import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        image: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (existingUser) return; // already exists — never overwrite

        // insert with "pending" role — user must select role on first login
        return await ctx.db.insert("users", {
            ...args,
            role: "pending",
        });
    },
});

// Called once after role selection — enforces immutability
export const updateUserRole = mutation({
    args: {
        clerkId: v.string(),
        role: v.union(v.literal("candidate"), v.literal("interviewer")),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) throw new Error("User not found");

        // CRITICAL: role can only be set if currently pending
        if (user.role !== "pending") {
            throw new Error("Role has already been set and cannot be changed");
        }

        await ctx.db.patch(user._id, { role: args.role });
    },
});

export const getUsers = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated!");
        const users = await ctx.db.query("users").collect();
        if (users.length === 0) throw new Error("No users found!");
        return users;
    },
});

export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();
        if (!user) throw new Error("User not found!");
        return user;
    },
});