import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendLog = mutation({
    args: {
        userId: v.string(),
        body: v.string(),
        gameId: v.string(),
    },
    handler: async (ctx, args) => {
        console.log("This TypeScript function running on the server.");
        await ctx.db.insert("gameLog", {
            userId: args.userId,
            body: args.body,
            gameId: args.gameId,
        });
    },
});

export const getLastUserLogs = query({
    args: {
        gameId: v.string(),
        userIds: v.array(v.string()), // Accept an array of two user IDs
    },
    handler: async (ctx, args) => {
        const logs = await ctx.db.query("gameLog")
            .filter((q) =>
                q.and(
                    q.eq(q.field("gameId"), args.gameId),
                    q.or(
                        q.eq(q.field("userId"), args.userIds[0]),
                        q.eq(q.field("userId"), args.userIds[1])
                    ) // Match any of the two user IDs
                )
            )
            .order("desc")
            .take(2); // Get the most recent logs for the two users
        return logs;
    },
});
