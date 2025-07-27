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

export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions", 
    name: "Trigger Recurring Transactions",
  },
  { cron: "0 0 * * *" },
  async ({ step }) => {
    //1. Fetch all due recurring transactions
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },// Never processed
              { nextRecurringDate: {
                  lte: new Date(),
                },
              }, // Due date passed
            ],
          },
        });
      }
    );
    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: {transactionId: transaction.id,
          userId: transaction.userId,
        },
      }));
      await inngest.send(events);
    }
    return { triggered: recurringTransactions.length };
  }
);

export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    throttle: {
      limit: 10, // Only Process 10 transactions
      period: "1m", // per minute
      key: "event.data.userId", // per user
    },
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) =>{
    // Validate event date
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }
    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: {
          account: true,
        },
      });
      if (!transaction || !isTransactionDue(transaction)) return;
      await db.$transaction(async (tx) => {
        // Create new transaction
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });
        // Update account balance
        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });
        // Update last processed date and next recurring date
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);

function isTransactionDue(transaction) {
  // If no lastProcessed date, transaction is due
  if (!transaction.lastProcessed) return true;

  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);

  // Compare with nextDue date
  return nextDue <= today;
}
