"use client"

import ActionCard from "@/components/ActionCard"
import { QUICK_ACTIONS } from "@/constants"
import { useUserRole } from "@/hooks/useUserRole"
import { useQuery } from "convex/react"
import { useState } from "react"
import { api } from "../../../../convex/_generated/api"
import { useRouter } from "next/navigation"
import MeetingModal from "@/components/MeetingModal"
import LoaderUI from "@/components/LoaderUI"
import MeetingCard from "@/components/MeetingCard"
import { motion } from "framer-motion"

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0 },
}
const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.08 } },
}

export default function Home() {
    const router = useRouter()
    const { isInterviewer, isLoading } = useUserRole()
    const interviews = useQuery(api.interviews.getMyInterviews)
    const [showModel, setShowModel] = useState(false)
    const [modelType, setModelType] = useState<"start" | "join">()

    const handleQuickAction = (title: string) => {
        switch (title) {
            case "New Call":        setModelType("start"); setShowModel(true); break
            case "Join Interview":  setModelType("join");  setShowModel(true); break
            default:                router.push(`/${title.toLowerCase()}`)
        }
    }

    if (isLoading) return <LoaderUI />

    return (
        <div className="relative min-h-[calc(100vh-68px)] overflow-hidden">

            {/* grid lines */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.018]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/* ambient orb */}
            <div
                className="pointer-events-none absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.06] z-0"
                style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }}
            />

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-10 space-y-10">

                {/* HERO */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-2xl px-8 py-9"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 64px rgba(0,0,0,0.35)",
                    }}
                >
                    {/* shimmer top line */}
                    <div className="shimmer-line absolute top-0 left-0 right-0 h-[1.5px]" />

                    {/* bg bloom */}
                    <div
                        className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full blur-3xl"
                        style={{ background: "rgba(251,191,36,0.07)" }}
                    />
                    <div
                        className="pointer-events-none absolute -bottom-8 right-10 w-48 h-48 rounded-full blur-3xl"
                        style={{ background: "rgba(245,158,11,0.05)" }}
                    />

                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2">
                            <p
                                className="text-[10px] font-bold tracking-[0.22em] uppercase"
                                style={{ color: "rgba(251,191,36,0.65)" }}
                            >
                                {isInterviewer ? "Interviewer Dashboard" : "Candidate Portal"}
                            </p>

                            <h1
                                className="text-5xl font-black tracking-[-0.03em] leading-none"
                                style={{
                                    background: "linear-gradient(135deg, #f0f0f4 0%, #a0a0b0 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Welcome back
                                <span
                                    style={{
                                        background: "linear-gradient(135deg, #fcd34d, #f59e0b)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                    }}
                                >.</span>
                            </h1>

                            <p className="text-[13px] text-zinc-500 max-w-md leading-relaxed pt-1">
                                {isInterviewer
                                    ? "Manage your interviews and review candidates effectively"
                                    : "Access your upcoming interviews and prepare with confidence"}
                            </p>
                        </div>

                        {/* stat pill */}
                        <div
                            className="shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-xl self-start sm:self-auto"
                            style={{
                                background: "rgba(251,191,36,0.07)",
                                border: "1px solid rgba(251,191,36,0.15)",
                            }}
                        >
                            <motion.div
                                className="w-2 h-2 rounded-full"
                                style={{ background: "#fbbf24", boxShadow: "0 0 8px rgba(251,191,36,0.8)" }}
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-[12px] font-semibold tracking-wide" style={{ color: "rgba(251,191,36,0.90)" }}>
                                System Online
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* INTERVIEWER — QUICK ACTIONS */}
                {isInterviewer ? (
                    <>
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            transition={{ duration: 0.4, delay: 0.12 }}
                            className="flex items-center gap-3"
                        >
                            <p
                                className="text-[10px] font-bold tracking-[0.18em] uppercase"
                                style={{ color: "rgba(255,255,255,0.20)" }}
                            >
                                Quick Actions
                            </p>
                            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                        </motion.div>

                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            animate="show"
                            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                            {QUICK_ACTIONS.map((action) => (
                                <motion.div
                                    key={action.title}
                                    variants={fadeUp}
                                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <ActionCard
                                        action={action}
                                        onClick={() => handleQuickAction(action.title)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        <MeetingModal
                            isOpen={showModel}
                            onClose={() => setShowModel(false)}
                            title={modelType === "join" ? "Join a Meeting" : "Start a Meeting"}
                            isJoinMeeting={modelType === "join"}
                        />
                    </>
                ) : (
                    /* CANDIDATE — INTERVIEWS LIST */
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-7"
                    >
                        <motion.div
                            variants={fadeUp}
                            transition={{ duration: 0.38 }}
                            className="flex items-end justify-between"
                        >
                            <div className="space-y-0.5">
                                <p
                                    className="text-[10px] font-bold tracking-[0.18em] uppercase mb-1"
                                    style={{ color: "rgba(251,191,36,0.55)" }}
                                >
                                    Scheduled
                                </p>
                                <h2
                                    className="text-3xl font-black tracking-[-0.025em]"
                                    style={{ color: "#f0f0f4" }}
                                >
                                    Your Interviews
                                </h2>
                                <p className="text-[12px] text-zinc-600">
                                    View and join your scheduled sessions
                                </p>
                            </div>

                            {interviews && interviews.length > 0 && (
                                <div
                                    className="px-3.5 py-1.5 rounded-full text-[11px] font-bold"
                                    style={{
                                        background: "rgba(251,191,36,0.08)",
                                        border: "1px solid rgba(251,191,36,0.18)",
                                        color: "rgba(251,191,36,0.80)",
                                    }}
                                >
                                    {interviews.length} session{interviews.length !== 1 ? "s" : ""}
                                </div>
                            )}
                        </motion.div>

                        {/* divider */}
                        <motion.div
                            variants={fadeUp}
                            className="h-px w-full"
                            style={{ background: "linear-gradient(90deg, rgba(251,191,36,0.25), rgba(255,255,255,0.04) 60%, transparent)" }}
                        />

                        {/* grid / states */}
                        {interviews === undefined ? (
                            <motion.div variants={fadeUp} className="flex justify-center py-24">
                                <div className="relative flex items-center justify-center w-16 h-16">
                                    <motion.div
                                        className="absolute rounded-full"
                                        style={{ width: 60, height: 60, border: "1px solid rgba(251,191,36,0.22)" }}
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ background: "linear-gradient(135deg,#fcd34d,#f59e0b)", boxShadow: "0 0 12px rgba(251,191,36,0.7)" }}
                                    />
                                </div>
                            </motion.div>
                        ) : interviews.length > 0 ? (
                            <motion.div variants={stagger} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {interviews.map((interview) => (
                                    <motion.div
                                        key={interview._id}
                                        variants={fadeUp}
                                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <MeetingCard interview={interview} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={fadeUp}
                                className="flex flex-col items-center justify-center py-28 gap-4"
                            >
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                                    style={{
                                        background: "rgba(251,191,36,0.06)",
                                        border: "1px solid rgba(251,191,36,0.12)",
                                    }}
                                >
                                    📅
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-[14px] font-semibold text-zinc-400">No interviews scheduled</p>
                                    <p className="text-[12px] text-zinc-700">Your upcoming sessions will appear here</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    )
}