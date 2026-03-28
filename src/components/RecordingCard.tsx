import { calculateRecordingDuration } from "@/lib/utils";
import { CallRecording } from "@stream-io/video-react-sdk";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { CalendarIcon, ClockIcon, CopyIcon, PlayIcon } from "lucide-react";
import { motion } from "framer-motion";

function RecordingCard({ recording }: { recording: CallRecording }) {
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(recording.url);
            toast.success("Link copied to clipboard");
        } catch (error) {
            console.log("Error in copying link", error);
            toast.error("Failed to copy link");
        }
    };

    const formattedStartTime = recording.start_time
        ? format(new Date(recording.start_time), "MMM d, yyyy · h:mm a")
        : "Unknown";
    const duration =
        recording.start_time && recording.end_time
            ? calculateRecordingDuration(recording.start_time, recording.end_time)
            : "Unknown duration";

    return (
        <div
            className="group relative overflow-hidden rounded-2xl flex flex-col"
            style={{
                background: "rgba(255,255,255,0.032)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                transition: "border-color 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(251,191,36,0.28)";
                el.style.boxShadow = "0 0 32px rgba(251,191,36,0.10), 0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)";
            }}
            onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.05)";
            }}
        >
            {/* top accent line on hover */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.7) 30%, rgba(252,211,77,0.5) 70%, transparent)" }}
            />

            {/* corner glow */}
            <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "rgba(251,191,36,0.12)" }}
            />

            {/* video thumbnail */}
            <div
                className="relative w-full aspect-video bg-[#0d0d14] flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => window.open(recording.url, "_blank")}
            >
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                <motion.div
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                        background: "rgba(251,191,36,0.12)",
                        border: "1px solid rgba(251,191,36,0.28)",
                        boxShadow: "0 0 24px rgba(251,191,36,0.20)",
                    }}
                >
                    <PlayIcon className="size-6 text-amber-400 ml-0.5" />
                </motion.div>
            </div>

            {/* info */}
            <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                        <CalendarIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                        <span>{formattedStartTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                        <ClockIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                        <span>{duration}</span>
                    </div>
                </div>

                <div className="flex gap-2 pt-1">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => window.open(recording.url, "_blank")}
                        className="btn-emerald flex-1 py-2 rounded-xl text-[12px] tracking-wide flex items-center justify-center gap-2"
                    >
                        <PlayIcon className="size-3.5" />
                        Play Recording
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyLink}
                        className="btn-ghost w-10 h-9 rounded-xl flex items-center justify-center shrink-0"
                    >
                        <CopyIcon className="size-3.5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

export default RecordingCard;