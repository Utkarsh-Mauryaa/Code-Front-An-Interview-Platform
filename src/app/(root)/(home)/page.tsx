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
import RoleSelection from "@/components/RoleSelection"
import { motion, AnimatePresence } from "framer-motion"
import useMeetingActions from "@/hooks/useMeetingActions"
import { Link2Icon, ArrowRightIcon, XIcon } from "lucide-react"

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
    const { isInterviewer, isLoading, isPending } = useUserRole()
    const interviews = useQuery(api.interviews.getMyInterviews)
    const [showModel, setShowModel] = useState(false)
    const [modelType, setModelType] = useState<"start" | "join">()

    // candidate join-by-link state
    const [joinUrl, setJoinUrl] = useState("")
    const [joinError, setJoinError] = useState("")
    const { JoinMeeting } = useMeetingActions()

    const handleQuickAction = (title: string) => {
        switch (title) {
            case "New Call":        setModelType("start"); setShowModel(true); break
            case "Join Interview":  setModelType("join");  setShowModel(true); break
            default:                router.push(`/${title.toLowerCase()}`)
        }
    }

    const handleJoinByLink = () => {
        setJoinError("")
        const trimmed = joinUrl.trim()
        if (!trimmed) {
            setJoinError("Please paste a meeting link first")
            return
        }
        const meetingId = trimmed.split("/").pop()
        if (!meetingId) {
            setJoinError("Invalid meeting link")
            return
        }
        JoinMeeting(meetingId)
    }

    if (isLoading) return <LoaderUI />
    if (isPending) return <RoleSelection />

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
                    <div className="shimmer-line absolute top-0 left-0 right-0 h-[1.5px]" />
                    <div className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full blur-3xl" style={{ background: "rgba(251,191,36,0.07)" }} />
                    <div className="pointer-events-none absolute -bottom-8 right-10 w-48 h-48 rounded-full blur-3xl" style={{ background: "rgba(245,158,11,0.05)" }} />

                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(251,191,36,0.65)" }}>
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
                                <span style={{
                                    background: "linear-gradient(135deg, #fcd34d, #f59e0b)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}>.</span>
                            </h1>
                            <p className="text-[13px] text-zinc-500 max-w-md leading-relaxed pt-1">
                                {isInterviewer
                                    ? "Manage your interviews and review candidates effectively"
                                    : "Access your upcoming interviews and prepare with confidence"}
                            </p>
                        </div>

                        <div
                            className="shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-xl self-start sm:self-auto"
                            style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.15)" }}
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
                            variants={fadeUp} initial="hidden" animate="show"
                            transition={{ duration: 0.4, delay: 0.12 }}
                            className="flex items-center gap-3"
                        >
                            <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.20)" }}>
                                Quick Actions
                            </p>
                            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                        </motion.div>

                        <motion.div
                            variants={stagger} initial="hidden" animate="show"
                            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                            {QUICK_ACTIONS.map((action) => (
                                <motion.div key={action.title} variants={fadeUp} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
                                    <ActionCard action={action} onClick={() => handleQuickAction(action.title)} />
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
                    /* ── CANDIDATE SECTION ── */
                    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-7">

                        {/* ── JOIN BY LINK ── */}
                        <motion.div
                            variants={fadeUp}
                            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                            className="relative overflow-hidden rounded-2xl p-6 w-[50%] m-auto"
                            style={{
                                background: "rgba(255,255,255,0.025)",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                            }}
                        >
                            {/* shimmer line */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[1.5px]"
                                style={{ background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.5) 40%, rgba(252,211,77,0.35) 60%, transparent)" }}
                            />
                            {/* corner glow */}
                            <div
                                className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-[0.07]"
                                style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }}
                            />

                            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
                                {/* label + icon */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{
                                            background: "rgba(251,191,36,0.10)",
                                            border: "1px solid rgba(251,191,36,0.22)",
                                        }}
                                    >
                                        <Link2Icon className="size-4 text-amber-400" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-zinc-200 tracking-tight">Have an invite link?</p>
                                        <p className="text-[11px] text-zinc-600">Paste it below to join instantly</p>
                                    </div>
                                </div>

                                {/* input + button */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Link2Icon
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-600 pointer-events-none"
                                                strokeWidth={1.8}
                                            />
                                            <input
                                                value={joinUrl}
                                                onChange={e => { setJoinUrl(e.target.value); setJoinError("") }}
                                                onKeyDown={e => e.key === "Enter" && handleJoinByLink()}
                                                placeholder="https://codesync.io/meeting/..."
                                                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-[13px] text-zinc-200 placeholder:text-zinc-700 outline-none transition-all duration-200"
                                                style={{
                                                    background: "rgba(255,255,255,0.04)",
                                                    border: joinError
                                                        ? "1px solid rgba(248,113,113,0.40)"
                                                        : "1px solid rgba(255,255,255,0.08)",
                                                }}
                                                onFocus={e => {
                                                    if (!joinError) {
                                                        e.currentTarget.style.borderColor = "rgba(251,191,36,0.40)"
                                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(251,191,36,0.08)"
                                                    }
                                                }}
                                                onBlur={e => {
                                                    e.currentTarget.style.borderColor = joinError ? "rgba(248,113,113,0.40)" : "rgba(255,255,255,0.08)"
                                                    e.currentTarget.style.boxShadow = "none"
                                                }}
                                            />
                                            {/* clear button */}
                                            <AnimatePresence>
                                                {joinUrl && (
                                                    <motion.button
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        onClick={() => { setJoinUrl(""); setJoinError("") }}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                                                    >
                                                        <XIcon className="size-3.5" />
                                                    </motion.button>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={handleJoinByLink}
                                            className="btn-emerald shrink-0 px-5 py-2.5 rounded-xl text-[13px] font-semibold flex items-center gap-2"
                                        >
                                            Join
                                            <ArrowRightIcon className="size-3.5" />
                                        </motion.button>
                                    </div>

                                    {/* error message */}
                                    <AnimatePresence>
                                        {joinError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -4 }}
                                                className="text-[11px] text-red-400 pl-1"
                                            >
                                                {joinError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── SCHEDULED INTERVIEWS header ── */}
                        <motion.div
                            variants={fadeUp}
                            transition={{ duration: 0.38 }}
                            className="flex items-end justify-between"
                        >
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: "rgba(251,191,36,0.55)" }}>
                                    Scheduled
                                </p>
                                <h2 className="text-3xl font-black tracking-[-0.025em]" style={{ color: "#f0f0f4" }}>
                                    Your Interviews
                                </h2>
                                <p className="text-[12px] text-zinc-600">View and join your scheduled sessions</p>
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

                        <motion.div
                            variants={fadeUp}
                            className="h-px w-full"
                            style={{ background: "linear-gradient(90deg, rgba(251,191,36,0.25), rgba(255,255,255,0.04) 60%, transparent)" }}
                        />

                        {/* interviews grid / states */}
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
                            <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 gap-4">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                                    style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)" }}
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