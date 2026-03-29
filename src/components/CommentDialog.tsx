"use client";

import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { MessageSquareIcon, StarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { getInterviewerInfo } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

function CommentDialog({ interviewId }: { interviewId: Id<"interviews"> }) {
    const [isOpen, setIsOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(3);

    const addComment = useMutation(api.comments.addComment);
    const users = useQuery(api.users.getUsers);
    const existingComments = useQuery(api.comments.getComments, { interviewId });

    const handleSubmit = async () => {
        if (!comment.trim()) return toast.error("Comment is required");
        try {
            await addComment({ interviewId, content: comment.trim(), rating });
            toast.success("Comment added successfully");
            setComment("");
            setRating(3);
            setIsOpen(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to add comment");
        }
    };

    const renderStars = (value: number) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    className={`h-3.5 w-3.5 transition-colors ${star <= value ? "fill-amber-400 text-amber-400" : "text-slate-600 fill-transparent"}`}
                />
            ))}
        </div>
    );

    if (existingComments === undefined || users === undefined) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full h-8 sm:h-9 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-white/8 hover:border-white/15 transition-all duration-200 gap-2"
                >
                    <MessageSquareIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {existingComments.length > 0
                        ? `${existingComments.length} Comment${existingComments.length !== 1 ? "s" : ""}`
                        : "Add Comment"}
                </Button>
            </DialogTrigger>

            {/* full-width on mobile, fixed on sm+ */}
            <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[580px] bg-[#13131e] border-white/10 rounded-2xl text-white">
                <DialogHeader className="pb-1">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-sm sm:text-base font-semibold text-white">Interview Feedback</DialogTitle>
                        {existingComments.length > 0 && (
                            <Badge className="bg-amber-400/10 text-amber-400 border-amber-400/20 text-xs rounded-lg mr-5">
                                {existingComments.length} comment{existingComments.length !== 1 ? "s" : ""}
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-5">
                    <AnimatePresence>
                        {existingComments.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                                <p className="text-xs font-medium text-slate-500 tracking-wider">Previous Feedback</p>
                                <ScrollArea className="h-[180px] sm:h-[220px] pr-1">
                                    <div className="space-y-3">
                                        {existingComments.map((c, index) => {
                                            const interviewer = getInterviewerInfo(users, c.interviewerId);
                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="rounded-xl border border-white/8 bg-[#0a0a0f] p-3 sm:p-4 space-y-2 sm:space-y-3"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6 sm:h-7 sm:w-7 shrink-0">
                                                                <AvatarImage src={interviewer.image} />
                                                                <AvatarFallback className="bg-amber-400/10 text-amber-400 text-[10px]">{interviewer.initials}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-xs sm:text-sm font-medium text-white">{interviewer.name}</p>
                                                                <p className="text-[10px] sm:text-xs text-slate-500">
                                                                    {format(c._creationTime, "MMM d, yyyy · h:mm a")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {renderStars(c.rating)}
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{c.content}</p>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {existingComments.length > 0 && <div className="border-t border-white/8" />}

                    <div className="space-y-3 sm:space-y-4">
                        <p className="text-xs font-medium text-slate-500 tracking-wider">Your Feedback</p>

                        <div className="space-y-1.5">
                            <Label className="text-xs text-slate-400">Rating</Label>
                            <Select value={rating.toString()} onValueChange={(val) => setRating(Number(val))}>
                                <SelectTrigger className="bg-[#0a0a0f] border-white/10 text-white rounded-xl h-9 sm:h-10 hover:border-amber-400/40 transition-colors text-sm w-full">
                                    <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#13131e] border-white/10 text-white rounded-xl">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <SelectItem key={value} value={value.toString()} className="hover:bg-white/5 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                {renderStars(value)}
                                                <span className="text-xs text-slate-400">{["Poor", "Fair", "Good", "Great", "Excellent"][value - 1]}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs text-slate-400">Comment</Label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your detailed feedback about the candidate's performance..."
                                className="bg-[#0a0a0f] border-white/10 text-white placeholder:text-slate-600 rounded-xl h-24 sm:h-28 focus:border-amber-400/50 transition-colors resize-none text-sm w-full"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
                    <Button
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl px-5 transition-all duration-200 shadow-lg shadow-amber-400/20 w-full sm:w-auto"
                    >
                        Submit Feedback
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CommentDialog;