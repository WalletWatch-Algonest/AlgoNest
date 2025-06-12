import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
    try {
        const user = await currentUser();

        if (!user) return null;

        let loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id,
            },
        });

        if (loggedInUser) return loggedInUser;

        const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

        loggedInUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl,
                email: user.emailAddresses?.[0]?.emailAddress ?? "",
            },
        });

        return loggedInUser;

    } catch (error) {
        console.error("Error in checkUser:", error);
        return null;
    }
};
