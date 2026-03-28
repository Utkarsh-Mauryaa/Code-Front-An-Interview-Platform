"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import useMeetingActions from "@/hooks/useMeetingActions"
import { motion, AnimatePresence } from "framer-motion"
import { VideoIcon, Link2Icon, XIcon } from "lucide-react"

interface MeetingModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    isJoinMeeting: boolean
}

function MeetingModal({ isOpen, onClose, title, isJoinMeeting }: MeetingModalProps) {
    const [meetingUrl, setMeetingUrl] = useState("")
    const { createInstantMeeting, JoinMeeting } = useMeetingActions()

    const handleStart = () => {
        if (isJoinMeeting) {
            const meetingId = meetingUrl.split("/").pop()
            if (meetingId) JoinMeeting(meetingId)
        } else {
            createInstantMeeting()
        }
        setMeetingUrl("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-[440px] border-0 p-0 overflow-hidden rounded-2xl"
                style={{
                    background: "rgba(10,10,15,0.96)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(251,191,36,0.07)",
                }}
            >
                {/* shimmer top line */}
                <div className="shimmer-line h-[1.5px] w-full" />

                <div className="p-7">
                    <DialogHeader className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{
                                        background: "rgba(251,191,36,0.10)",
                                        border: "1px solid rgba(251,191,36,0.22)",
                                    }}
                                >
                                    {isJoinMeeting
                                        ? <Link2Icon className="w-4 h-4 text-amber-400" strokeWidth={2} />
                                        : <VideoIcon  className="w-4 h-4 text-amber-400" strokeWidth={2} />
                                    }
                                </div>
                                <div>
                                    <DialogTitle className="text-[15px] font-bold tracking-[-0.01em] text-zinc-100">
                                        {title}
                                    </DialogTitle>
                                    <p className="text-[11px] text-zinc-600 mt-0.5">
                                        {isJoinMeeting ? "Paste your invite link below" : "A new call will be created instantly"}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    color: "rgba(255,255,255,0.35)",
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"
                                    ;(e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"
                                    ;(e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"
                                }}
                            >
                                <XIcon className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </DialogHeader>

                    <div className="space-y-5">
                        <AnimatePresence>
                            {isJoinMeeting && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative">
                                        <Link2Icon
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600"
                                            strokeWidth={1.8}
                                        />
                                        <input
                                            placeholder="https://codesync.io/meeting/..."
                                            value={meetingUrl}
                                            onChange={e => setMeetingUrl(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl text-[13px] text-zinc-200 placeholder:text-zinc-700 outline-none transition-all duration-200"
                                            style={{
                                                background: "rgba(255,255,255,0.04)",
                                                border: "1px solid rgba(255,255,255,0.09)",
                                            }}
                                            onFocus={e => {
                                                e.currentTarget.style.borderColor = "rgba(251,191,36,0.40)"
                                                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(251,191,36,0.08)"
                                            }}
                                            onBlur={e => {
                                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"
                                                e.currentTarget.style.boxShadow = "none"
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={onClose}
                                className="btn-ghost flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                            >
                                Cancel
                            </button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleStart}
                                disabled={isJoinMeeting && !meetingUrl.trim()}
                                className="btn-emerald flex-1 py-2.5 rounded-xl text-[13px] tracking-wide"
                            >
                                {isJoinMeeting ? "Join Meeting" : "Start Meeting"}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MeetingModal