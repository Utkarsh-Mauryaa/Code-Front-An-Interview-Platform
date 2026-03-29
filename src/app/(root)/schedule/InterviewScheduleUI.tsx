"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { CalendarDaysIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";

function InterviewScheduleUI() {
    const client = useStreamVideoClient();
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
    const users = useQuery(api.users.getUsers) ?? [];
    const createInterview = useMutation(api.interviews.createInterview);

    const candidates = users?.filter((u) => u.role === "candidate");
    const interviewers = users?.filter((u) => u.role === "interviewer");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
    });

    const scheduleMeeting = async () => {
        if (!client || !user) return;
        if (!formData.candidateId || formData.interviewerIds.length === 0) {
            toast.error("Please select a candidate and at least one interviewer!");
            return;
        }
        setIsCreating(true);
        try {
            const { title, description, date, time, candidateId, interviewerIds } = formData;
            const [hours, minutes] = time.split(":");
            const meetingDate = new Date(date);
            meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);
            const id = crypto.randomUUID();
            const call = client.call("default", id);
            await call.getOrCreate({
                data: {
                    starts_at: meetingDate.toISOString(),
                    custom: { description: title, additionalDetails: description },
                },
            });
            await createInterview({
                title, description,
                startTime: meetingDate.getTime(),
                status: "upcoming",
                streamCallId: id,
                candidateId,
                interviewerIds,
            });
            toast.success("Interview scheduled successfully!");
            setOpen(false);
            setFormData({
                title: "", description: "", date: new Date(), time: "09:00",
                candidateId: "", interviewerIds: user?.id ? [user.id] : [],
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to schedule interview");
        } finally {
            setIsCreating(false);
        }
    };

    const addInterviewer = (interviewerId: string) => {
        if (!formData.interviewerIds.includes(interviewerId)) {
            setFormData((prev) => ({ ...prev, interviewerIds: [...prev.interviewerIds, interviewerId] }));
        }
    };

    const removeInterviewer = (interviewerId: string) => {
        if (interviewerId === user?.id) return;
        setFormData((prev) => ({
            ...prev,
            interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
        }));
    };

    const selectedInterviewers = interviewers.filter((i) => formData.interviewerIds.includes(i.clerkId));
    const availableInterviewers = interviewers.filter((i) => !formData.interviewerIds.includes(i.clerkId));

    return (
        <div className="min-h-screen text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.22em] mb-1" style={{ color: "rgba(251,191,36,0.60)" }}>
                            Interviewer Panel
                        </p>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                            Interviews
                            <span style={{
                                background: "linear-gradient(135deg, #fcd34d, #f59e0b)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}>.</span>
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm sm:text-base">Schedule and manage technical interviews</p>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl px-5 h-10 transition-all duration-200 shadow-lg shadow-amber-400/20">
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Schedule Interview
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[520px] max-h-[calc(100vh-80px)] overflow-auto bg-[#13131e] border-white/10 rounded-2xl text-white">
                            <DialogHeader className="pb-2">
                                <DialogTitle className="text-base sm:text-lg font-semibold text-white">Schedule New Interview</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 sm:space-y-5 py-2">
                                {/* Title */}
                                <div className="space-y-1.5">
                                    <label className="text-xs sm:text-sm font-medium text-slate-400 tracking-wider">Title</label>
                                    <Input
                                        placeholder="e.g. Frontend Engineering Round 1"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="bg-[#0a0a0f] border-white/10 text-white placeholder:text-slate-600 rounded-xl h-10 focus:border-amber-400/50 transition-colors text-sm"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-1.5">
                                    <label className="text-xs sm:text-sm font-medium text-slate-400 tracking-wider">Description</label>
                                    <Textarea
                                        placeholder="Topics to cover, notes for interviewers..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="bg-[#0a0a0f] border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:border-amber-400/50 transition-colors resize-none h-20 text-sm"
                                    />
                                </div>

                                {/* Candidate */}
                                <div className="space-y-1.5">
                                    <label className="text-xs sm:text-sm font-medium text-slate-400 tracking-wider">Candidate</label>
                                    <Select value={formData.candidateId} onValueChange={(candidateId) => setFormData({ ...formData, candidateId })}>
                                        <SelectTrigger className="bg-[#0a0a0f] border-white/10 text-white rounded-xl h-10 hover:border-amber-400/40 transition-colors text-sm w-full">
                                            <SelectValue placeholder="Select candidate" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#13131e] border-white/10 text-white rounded-xl">
                                            {candidates.map((candidate) => (
                                                <SelectItem key={candidate.clerkId} value={candidate.clerkId} className="hover:bg-white/5 rounded-lg text-sm">
                                                    <UserInfo user={candidate} />
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Interviewers */}
                                <div className="space-y-1.5">
                                    <label className="text-xs sm:text-sm font-medium text-slate-400 tracking-wider">Interviewers</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <AnimatePresence>
                                            {selectedInterviewers.map((interviewer) => (
                                                <motion.div
                                                    key={interviewer.clerkId}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg text-xs text-amber-300"
                                                >
                                                    <UserInfo user={interviewer} />
                                                    {interviewer.clerkId !== user?.id && (
                                                        <button onClick={() => removeInterviewer(interviewer.clerkId)} className="hover:text-red-400 transition-colors">
                                                            <XIcon className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                    {availableInterviewers.length > 0 && (
                                        <Select onValueChange={addInterviewer}>
                                            <SelectTrigger className="bg-[#0a0a0f] border-white/10 text-white rounded-xl h-10 hover:border-amber-400/40 transition-colors text-sm w-full">
                                                <SelectValue placeholder="Add interviewer" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#13131e] border-white/10 text-white rounded-xl">
                                                {availableInterviewers.map((interviewer) => (
                                                    <SelectItem key={interviewer.clerkId} value={interviewer.clerkId} className="hover:bg-white/5 rounded-lg text-sm">
                                                        <UserInfo user={interviewer} />
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                {/* Date + Time — stack on mobile */}
                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                    <div className="space-y-1.5 w-full sm:flex-1">
                                        <label className="text-xs font-medium text-slate-400 tracking-wider">Date</label>
                                        <div className="rounded-xl border border-white/10 bg-[#0a0a0f] overflow-hidden">
                                            <Calendar
                                                mode="single"
                                                selected={formData.date}
                                                onSelect={(date) => date && setFormData({ ...formData, date })}
                                                disabled={(date) => date < new Date()}
                                                className="text-white w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 w-full sm:w-[130px]">
                                        <label className="text-xs font-medium text-slate-400 tracking-wider">Time</label>
                                        <Select value={formData.time} onValueChange={(time) => setFormData({ ...formData, time })}>
                                            <SelectTrigger className="bg-[#0a0a0f] border-white/10 text-white rounded-xl h-10 hover:border-amber-400/40 transition-colors text-sm w-full">
                                                <SelectValue placeholder="Select time" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#13131e] border-white/10 text-white rounded-xl max-h-[200px] overflow-y-auto">
                                                {TIME_SLOTS.map((timeSlot) => (
                                                    <SelectItem key={timeSlot} value={timeSlot} className="hover:bg-white/5 rounded-lg text-xs">
                                                        {timeSlot}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setOpen(false)}
                                        className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl w-full sm:w-auto"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={scheduleMeeting}
                                        disabled={isCreating}
                                        className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl px-5 transition-all duration-200 shadow-lg shadow-amber-400/20 w-full sm:w-auto"
                                    >
                                        {isCreating ? (
                                            <>
                                                <Loader2Icon className="mr-2 size-4 animate-spin" />
                                                Scheduling…
                                            </>
                                        ) : (
                                            "Schedule Interview"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </motion.div>

                {/* Interviews Grid */}
                {!interviews ? (
                    <div className="flex justify-center py-16 sm:py-20">
                        <Loader2Icon className="size-7 animate-spin text-amber-400" />
                    </div>
                ) : interviews.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                    >
                        {interviews.map((interview, i) => (
                            <motion.div
                                key={interview._id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06, duration: 0.35 }}
                            >
                                <MeetingCard interview={interview} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4"
                    >
                        <div className="p-4 rounded-2xl bg-[#13131e] border border-white/8">
                            <CalendarDaysIcon className="size-7 sm:size-8 text-slate-500" />
                        </div>
                        <p className="text-slate-500 text-sm">No interviews scheduled yet</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default InterviewScheduleUI;