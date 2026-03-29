import { QuickActionType } from "@/constants"
import { motion } from "framer-motion"

const ActionCard = ({ action, onClick }: { action: QuickActionType; onClick: () => void }) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.025, y: -3 }}
            whileTap={{ scale: 0.975 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="group relative w-full text-left overflow-hidden rounded-2xl cursor-pointer"
            style={{
                background: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                minHeight: "140px",
            }}
            onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "rgba(251,191,36,0.30)"
                el.style.boxShadow = "0 0 36px rgba(251,191,36,0.13), 0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
            }}
            onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "rgba(255,255,255,0.07)"
                el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.06)"
            }}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-[0.07] group-hover:opacity-[0.13] transition-opacity duration-400`} />
            <div
                className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "rgba(251,191,36,0.18)" }}
            />

            {/* content — tighter padding on mobile */}
            <div className="relative p-4 sm:p-6 flex flex-col gap-3 sm:gap-5 h-full">
                <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(251,191,36,0.30)]"
                    style={{
                        background: "rgba(251,191,36,0.10)",
                        border: "1px solid rgba(251,191,36,0.20)",
                    }}
                >
                    <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" strokeWidth={1.8} />
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                    <h3 className="font-bold text-[14px] sm:text-[15px] tracking-[-0.01em] text-zinc-100 group-hover:text-amber-300 transition-colors duration-200">
                        {action.title}
                    </h3>
                    <p className="text-[12px] sm:text-[13px] leading-relaxed text-zinc-500">
                        {action.description}
                    </p>
                </div>
            </div>

            <div
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{ background: "linear-gradient(90deg, rgba(251,191,36,0.8), rgba(245,158,11,0.4), transparent)" }}
            />
        </motion.button>
    )
}

export default ActionCard