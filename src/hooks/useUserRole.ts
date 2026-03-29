import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useUserRole = () => {
    const { user } = useUser();

    const userData = useQuery(api.users.getUserByClerkId, {
        clerkId: user?.id || "",
    });

    const isLoading   = userData === undefined;
    const isPending   = userData?.role === "pending";
    const isCandidate = userData?.role === "candidate";
    const isInterviewer = userData?.role === "interviewer";

    return { isLoading, isPending, isCandidate, isInterviewer };
};