import { db } from "../prisma";
import { inngest } from "./client";
import { sendEmail } from "@/actions/send-email";
export const checkBudgetAlert = inngest.createFunction(
  { id: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) {
        console.log(`Budget ${budget.id}: No default account. Skipping.`);
        continue;
      }

      await step.run(`check-budget-${budget.id}`, async () => {
        try {
        
          // Get current month's expenses
          const currentDate = new Date();
          const startOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );
          const endOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          );

          const expenses = await db.transaction.aggregate({
            where: {
              userId: budget.userId,
              accountId: defaultAccount.id, // only consisder default account
              type: "EXPENSE",
              date: {
                gte: startOfMonth,
          lte: endOfMonth,
              },
            },
            _sum: {
              amount: true,
            },
          });

          const totalExpenses = expenses._sum.amount?.toNumber?.() || 0;
          const budgetAmount = budget.amount;
          const percentageUsed = (totalExpenses / budgetAmount) * 100;

          console.log(`Budget ${budget.id}: ${percentageUsed.toFixed(2)}% used`);

          const lastAlertDate = budget.lastAlertSent ? new Date(budget.lastAlertSent) : null;
          const shouldAlert =
            percentageUsed >= 80 &&
            (!budget.lastAlertDate || isNewMonth(lastAlertDate, new Date()));

          if (shouldAlert) {
            console.log(
              `⚠️ Budget ${budget.id} exceeds 80% usage. Sending alert. Last alert sent: ${budget.lastAlertSent}`
            );

            // TODO: Send email logic here
            await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name}`,
            react: EmailTemplate({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed,
                budgetAmount: parseInt(budgetAmount).toFixed(1),
                totalExpenses: parseInt(totalExpenses).toFixed(1),
                accountName: defaultAccount.name,
              },
            }),
          });

            // Update lastAlertSent
            await db.budget.update({
              where: { id: budget.id },
              data: { lastAlertSent: new Date() },
            });

            console.log(`✅ Budget ${budget.id}: lastAlertSent updated.`);
          } else {
            console.log(`Budget ${budget.id}: No alert needed.`);
          }
        } catch (err) {
          console.error(`❌ Error processing budget ${budget.id}:`, err);
        }
      });
    }
  }
);

// Safe check for new month
function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}
