
import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest/client";
<<<<<<< HEAD
import {
  checkBudgetAlerts,
  generateMonthlyReports,
  processRecurringTransaction,
  triggerRecurringTransactions,
} from "@/lib/inngest/functions";
=======
import { checkBudgetAlert, processRecurringTransaction, triggerRecurringTransactions  } from "@/lib/inngest/functions"; // export a function from here
>>>>>>> 15ab7c473bcc3511444b87c6bbba370148e02ad3

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
<<<<<<< HEAD
    processRecurringTransaction,
    triggerRecurringTransactions,
    generateMonthlyReports,
    checkBudgetAlerts,
  ],
});
=======
    checkBudgetAlert, triggerRecurringTransactions, processRecurringTransaction
  ], //  this is NOT an empty array
});
>>>>>>> 15ab7c473bcc3511444b87c6bbba370148e02ad3
