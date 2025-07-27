import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { checkBudgetAlert, processRecurringTransaction, triggerRecurringTransactions  } from "@/lib/inngest/functions"; // export a function from here

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkBudgetAlert, triggerRecurringTransactions, processRecurringTransaction
  ], //  this is NOT an empty array
});
