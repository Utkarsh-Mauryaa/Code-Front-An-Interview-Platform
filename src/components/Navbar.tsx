"use client"

import { CodeIcon } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "./ModeToggle"
import { useAuth, UserButton } from "@clerk/nextjs"
import DashboardBtn from "./DashboardBtn"
import { motion } from "framer-motion"

const Navbar = () => {
    const { isSignedIn } = useAuth()

    return (
        <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-0 z-50"
            style={{
                background: "rgba(8,8,12,0.80)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)",
            }}
        >
            {/* shimmer top line */}
            <div className="shimmer-line absolute top-0 left-0 right-0 h-[1.5px]" />

            <div className="flex h-[68px] items-center px-6 max-w-[1400px] mx-auto">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group mr-8 shrink-0">
                    <div className="relative">
                        <div
                            className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: "rgba(251,191,36,0.45)", transform: "scale(1.4)" }}
                        />
                        <div
                            className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{
                                background: "linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.15) 100%)",
                                border: "1px solid rgba(251,191,36,0.25)",
                            }}
                        >
                            <CodeIcon className="size-[18px] text-amber-400" strokeWidth={2.2} />
                        </div>
                    </div>

                    <div className="flex flex-col leading-none gap-2">
                        <span
                            className="font-black text-[19px] tracking-[-0.02em]"
                            style={{
                                background: "linear-gradient(135deg, #fcd34d 0%, #fbbf24 45%, #f59e0b 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                fontFamily: "var(--font-geist-mono), monospace",
                            }}
                        >
                            CodeSync
                        </span>
                        <span className="text-[9px] tracking-[0.18em] text-zinc-600 uppercase font-medium">
                            Interview Platform
                        </span>
                    </div>
                </Link>

                {/* Nav actions */}
                {isSignedIn && (
                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.18, ease: "easeOut" }}
                        className="ml-auto flex items-center gap-3"
                    >
                        <DashboardBtn />

                        <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />

                        <div className="relative">
                            <div
                                className="absolute inset-[-3px] rounded-full h-9 top-[-4.1px]"
                                style={{ border: "4px solid rgba(252, 199, 65, 0.2)" }}
                            />
                            <UserButton/>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    )
}

export default Navbar