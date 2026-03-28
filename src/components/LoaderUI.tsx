import { motion } from "framer-motion"

function LoaderUI() {
    return (
        <div className="h-[calc(100vh-4rem-1px)] flex flex-col items-center justify-center gap-5">
            {/* concentric pulse rings */}
            <div className="relative flex items-center justify-center w-20 h-20">
                {/* outer ring */}
                <motion.div
                    className="absolute rounded-full"
                    style={{ width: 76, height: 76, border: "1px solid rgba(251,191,36,0.20)" }}
                    animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* mid ring */}
                <motion.div
                    className="absolute rounded-full"
                    style={{ width: 52, height: 52, border: "1px solid rgba(251,191,36,0.30)" }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
                />
                {/* inner glow disc */}
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        width: 28, height: 28,
                        background: "radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)",
                        border: "1px solid rgba(251,191,36,0.45)",
                    }}
                    animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* center dot */}
                <motion.div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                        background: "linear-gradient(135deg, #fcd34d, #f59e0b)",
                        boxShadow: "0 0 12px rgba(251,191,36,0.7)",
                    }}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                />
            </div>

            <p
                className="text-[11px] tracking-[0.2em] uppercase font-semibold"
                style={{ color: "rgba(251,191,36,0.45)" }}
            >
                Loading
            </p>
        </div>
    )
}

export default LoaderUI