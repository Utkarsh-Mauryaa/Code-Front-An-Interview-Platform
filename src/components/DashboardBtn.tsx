import { SparklesIcon } from "lucide-react"
import Link from "next/link"
import { useUserRole } from "@/hooks/useUserRole"
import { motion } from "framer-motion"

function DashboardBtn() {
    const { isCandidate, isLoading } = useUserRole()
    if (isCandidate || isLoading) return null

    return (
        <Link href="/dashboard">
            <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer overflow-hidden"
                style={{
                    background: "rgba(251,191,36,0.07)",
                    border: "1px solid rgba(251,191,36,0.20)",
                    transition: "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = "rgba(251,191,36,0.13)"
                    el.style.borderColor = "rgba(251,191,36,0.38)"
                    el.style.boxShadow = "0 0 20px rgba(251,191,36,0.15)"
                }}
                onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = "rgba(251,191,36,0.07)"
                    el.style.borderColor = "rgba(251,191,36,0.20)"
                    el.style.boxShadow = "none"
                }}
            >
                <SparklesIcon className="size-3.5 text-amber-400" strokeWidth={1.8} />
                <span
                    className="text-[12px] font-bold tracking-wide"
                    style={{ color: "rgba(251,191,36,0.90)" }}
                >
                    Dashboard
                </span>
            </motion.div>
        </Link>
    )
}

export default DashboardBtn