import useMeetingActions from "@/hooks/useMeetingActions"
import { Doc } from "../../convex/_generated/dataModel"
import { getMeetingStatus } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, RadioIcon, ClockIcon, CheckCircle2Icon } from "lucide-react"
import { motion } from "framer-motion"

type Interview = Doc<"interviews">

const statusConfig = {
    live: {
        label: "Live Now",
        Icon: RadioIcon,
        textColor: "#fbbf24",
        bg: "rgba(251,191,36,0.10)",
        border: "rgba(251,191,36,0.28)",
        pulseDot: "#fbbf24",
        glowColor: "rgba(251,191,36,0.12)",
    },
    upcoming: {
        label: "Upcoming",
        Icon: ClockIcon,
        textColor: "rgba(255,255,255,0.55)",
        bg: "rgba(255,255,255,0.05)",
        border: "rgba(255,255,255,0.10)",
        pulseDot: null,
        glowColor: null,
    },
    completed: {
        label: "Completed",
        Icon: CheckCircle2Icon,
        textColor: "rgba(255,255,255,0.30)",
        bg: "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.07)",
        pulseDot: null,
        glowColor: null,
    },
} as const

type Status = keyof typeof statusConfig

function MeetingCard({ interview }: { interview: Interview }) {
    const { JoinMeeting } = useMeetingActions()
    const status = getMeetingStatus(interview) as Status
    const cfg = statusConfig[status]
    const formattedDate = format(new Date(interview.startTime), "EEE, MMM d · h:mm a")

    return (
        <div
            className="group relative overflow-hidden rounded-2xl flex flex-col h-full"
            style={{
                background: "rgba(255,255,255,0.032)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                transition: "border-color 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = status === "live"
                    ? "rgba(251,191,36,0.35)"
                    : "rgba(255,255,255,0.12)"
                el.style.boxShadow = status === "live"
                    ? "0 0 40px rgba(251,191,36,0.12), 0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)"
                    : "0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)"
            }}
            onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "rgba(255,255,255,0.07)"
                el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.05)"
            }}
        >
            {/* live ambient glow */}
            {status === "live" && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(251,191,36,0.10) 0%, transparent 70%)" }}
                />
            )}

            {/* top accent line for live */}
            {status === "live" && (
                <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.7) 30%, rgba(252,211,77,0.6) 60%, transparent)" }}
                />
            )}

            <div className="relative flex flex-col gap-4 p-5 flex-1">

                {/* header: date + status badge */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium tracking-wide">
                        <CalendarIcon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                        {formattedDate}
                    </div>

                    <div
                        className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-full shrink-0"
                        style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                    >
                        {cfg.pulseDot && (
                            <motion.span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: cfg.pulseDot }}
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.4, repeat: Infinity }}
                            />
                        )}
                        <cfg.Icon className="w-3 h-3" style={{ color: cfg.textColor }} strokeWidth={2} />
                        <span className="text-[10px] font-bold tracking-wide uppercase" style={{ color: cfg.textColor }}>
                            {cfg.label}
                        </span>
                    </div>
                </div>

                {/* title + description */}
                <div className="space-y-2 flex-1">
                    <h3
                        className="font-bold text-[15px] tracking-[-0.01em] leading-snug"
                        style={{ color: status === "completed" ? "rgba(255,255,255,0.45)" : "#f0f0f4" }}
                    >
                        {interview.title}
                    </h3>
                    {interview.description && (
                        <p className="text-[12px] leading-relaxed text-zinc-600 line-clamp-2">
                            {interview.description}
                        </p>
                    )}
                </div>

                {/* CTA */}
                {status === "live" && (
                    <motion.button
                        whileHover={{ scale: 1.025 }}
                        whileTap={{ scale: 0.975 }}
                        onClick={() => JoinMeeting(interview.streamCallId)}
                        className="btn-emerald w-full py-2.5 rounded-xl text-[13px] tracking-wide"
                    >
                        Join Now →
                    </motion.button>
                )}

                {status === "upcoming" && (
                    <div
                        className="w-full py-2.5 rounded-xl text-[12px] font-semibold tracking-wide text-center"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.30)",
                        }}
                    >
                        Waiting to Start
                    </div>
                )}
            </div>
        </div>
    )
}

export default MeetingCard