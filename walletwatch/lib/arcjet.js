import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"], // Track based on Clerk userId
  rules: [
    // Rate limiting specifically for collection creation
    tokenBucket({
      mode: "LIVE",
      refillRate: 2, // 10 collections
      interval: 3600, // per hour
      capacity: 2, // maximum burst capacity
    }),
  ],
});

export default aj;