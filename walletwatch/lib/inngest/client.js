import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "algo",
  name: "Algo",
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000,
  }),
});
