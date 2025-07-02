//import { db } from "@/prisma";
// app/api/debug/route.js
//import { db } from "../../../../prisma";
import { db } from "@/prisma";


import { NextResponse } from "next/server";

export async function GET() {
  const budgets = await db.budget.findMany({
    include: {
      user: {
        include: {
          accounts: {
            where: { isDefault: true },
          },
        },
      },
    },
  });

  for (const budget of budgets) {
    const defaultAccount = budget.user.accounts[0];
    if (!defaultAccount) continue;

    const startDate = new Date();
    startDate.setDate(1); // First day of this month

    const expenses = await db.transaction.aggregate({
      where: {
        userId: budget.userId,
        accountId: defaultAccount.id,
        type: "EXPENSE",
        date: { gte: startDate },
      },
      _sum: { amount: true },
    });

    const totalExpenses = expenses._sum.amount?.toNumber() || 0;
    const percentageUsed = (totalExpenses / budget.amount) * 100;

    console.log({
      budgetId: budget.id,
      budgetAmount: budget.amount,
      totalExpenses,
      percentageUsed,
      lastAlertSent: budget.lastAlertSent,
    });

    // Manually update lastAlertSent
    if (percentageUsed >= 0) {
      await db.budget.update({
        where: { id: budget.id },
        data: { lastAlertSent: new Date() },
      });
    }
  }

  return NextResponse.json({ message: "Debug run complete ✅" });
}
