import { db } from "../prisma";
import { inngest } from "./client";

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
          const startDate = new Date();
          startDate.setDate(1); // start of current month

          const expenses = await db.transaction.aggregate({
            where: {
              userId: budget.userId,
              accountId: defaultAccount.id,
              type: "EXPENSE",
              date: {
                gte: startDate,
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
            (!lastAlertDate || isNewMonth(lastAlertDate, new Date()));

          if (shouldAlert) {
            console.log(
              `⚠️ Budget ${budget.id} exceeds 80% usage. Sending alert. Last alert sent: ${budget.lastAlertSent}`
            );

            // TODO: Send email logic here

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
