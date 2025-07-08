import { db } from "../prisma";
import { inngest } from "./client";
import { sendEmail } from "@/actions/send-email";
import EmailTemplate from "@/emails/template";

// Optional: Check for missing API key
if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY in .env");
}

export const checkBudgetAlert = inngest.createFunction(
  { id: "Check Budget Alerts" },
  { cron: "0 */6 * * *" }, // Runs every 6 hours
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
              accountId: defaultAccount.id,
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

          const lastAlertDate = budget.lastAlertSent
            ? new Date(budget.lastAlertSent)
            : null;

          const shouldAlert = percentageUsed >= 80 && (
            !lastAlertDate ||
            lastAlertDate.getMonth() !== currentDate.getMonth() ||
            lastAlertDate.getFullYear() !== currentDate.getFullYear()
          );

          console.log(`Last alert sent: ${lastAlertDate}`);
          console.log(`Should alert? ${shouldAlert}`);

          if (shouldAlert) {
            console.log(`⚠️ Budget ${budget.id} exceeds 80%. Sending alert.`);

            await sendEmail({
              to: budget.user.email,
              subject: `Budget Alert for ${defaultAccount.name}`,
              react: EmailTemplate({
                userName: budget.user.name,
                type: "budget-alert",
                data: {
                  percentageUsed: percentageUsed.toFixed(1),
                  budgetAmount: budgetAmount.toFixed(1),
                  totalExpenses: totalExpenses.toFixed(1),
                  accountName: defaultAccount.name,
                },
              }),
            });

            await db.budget.update({
              where: { id: budget.id },
              data: { lastAlertSent: new Date() },
            });

            console.log(`✅ Alert sent & lastAlertSent updated for budget ${budget.id}`);
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
