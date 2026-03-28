"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INTERVIEW_CATEGORY } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, CheckCircle2Icon, ClockIcon, PlusIcon, XCircleIcon } from "lucide-react";
import { format } from "date-fns";
import CommentDialog from "@/components/CommentDialog";
import { motion } from "framer-motion";

type Interview = Doc<"interviews">;

const statusColors: Record<string, string> = {
  upcoming: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  completed: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  succeeded: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  failed: "bg-red-400/10 text-red-400 border-red-400/20",
};

function DashboardPage() {
  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews);
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);

  const handleUpdateStatus = async (interviewId: Id<"interviews">, status: string) => {
    try {
      await updateStatus({ id: interviewId, status });
      toast.success(`Interview marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update interview status");
    }
  };

  if (!interviews || !users) return <LoaderUI />;

  const groupedInterviews = groupInterviews(interviews);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="container mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-7xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-slate-500 mt-1 text-sm">Track and manage all interview sessions</p>
          </div>
          <Link href="/schedule">
            <Button className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl px-5 h-10 transition-all duration-200 shadow-lg shadow-amber-400/20 gap-2">
              <PlusIcon className="h-4 w-4" />
              Schedule Interview
            </Button>
          </Link>
        </motion.div>

        {/* Categories */}
        <div className="space-y-10">
          {INTERVIEW_CATEGORY.map((category, categoryIndex) =>
            groupedInterviews[category.id]?.length > 0 ? (
              <motion.section
                key={category.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.4 }}
              >
                {/* Section header */}
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-base font-semibold text-white">{category.title}</h2>
                  <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/8 text-xs text-slate-400 font-medium">
                    {groupedInterviews[category.id].length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedInterviews[category.id].map((interview: Interview, index: number) => {
                    const candidateInfo = getCandidateInfo(users, interview.candidateId);
                    const startTime = new Date(interview.startTime);

                    return (
                      <motion.div
                        key={interview._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <Card className="bg-[#13131e] border-white/8 rounded-2xl hover:border-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-black/30 overflow-hidden group">
                          <CardHeader className="p-5 pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 ring-2 ring-white/5">
                                  <AvatarImage src={candidateInfo.image} />
                                  <AvatarFallback className="bg-amber-400/10 text-amber-400 text-sm font-medium">
                                    {candidateInfo.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-xl font-semibold text-white">{candidateInfo.name}</p>
                                  <p className="text-[16px] text-slate-500 mt-0.5">{interview.title}</p>
                                </div>
                              </div>
                              <span className={`text-[14px] font-medium px-2 py-1 rounded-lg border ${statusColors[interview.status] || "bg-slate-400/10 text-slate-400 border-slate-400/20"}`}>
                                {interview.status}
                              </span>
                            </div>
                          </CardHeader>

                          <CardContent className="px-5 pb-4">
                            <div className="flex items-center gap-4 text-[15px] text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                {format(startTime, "MMM dd, yyyy")}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ClockIcon className="h-3.5 w-3.5" />
                                {format(startTime, "hh:mm a")}
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="px-5 pb-5 flex flex-col gap-2.5">
                            {interview.status === "completed" && (
                              <div className="flex gap-2 w-full">
                                <Button
                                  className="flex-1 h-9 rounded-xl bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 hover:text-emerald-300 border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-200 text-xs gap-1.5"
                                  onClick={() => handleUpdateStatus(interview._id, "succeeded")}
                                >
                                  <CheckCircle2Icon className="h-3.5 w-3.5" />
                                  Pass
                                </Button>
                                <Button
                                  className="flex-1 h-9 rounded-xl bg-red-400/10 hover:bg-red-400/20 text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/40 transition-all duration-200 text-xs gap-1.5"
                                  onClick={() => handleUpdateStatus(interview._id, "failed")}
                                >
                                  <XCircleIcon className="h-3.5 w-3.5" />
                                  Fail
                                </Button>
                              </div>
                            )}
                            <CommentDialog interviewId={interview._id} />
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;