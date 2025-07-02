// prisma/index.js
import { PrismaClient } from "@/lib/generated/prisma";

export const db = new PrismaClient();
