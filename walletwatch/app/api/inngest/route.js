import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { helloWorld } from "@/lib/inngest/functions"; // export a function from here

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld], //  this is NOT an empty array
});
