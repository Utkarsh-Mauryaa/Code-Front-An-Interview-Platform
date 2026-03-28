"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export function ModeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-8 h-8 rounded-xl flex items-center justify-center outline-none transition-all duration-200"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.45)",
                    }}
                    onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = "rgba(251,191,36,0.08)"
                        el.style.borderColor = "rgba(251,191,36,0.25)"
                        el.style.color = "#fbbf24"
                    }}
                    onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = "rgba(255,255,255,0.04)"
                        el.style.borderColor = "rgba(255,255,255,0.08)"
                        el.style.color = "rgba(255,255,255,0.45)"
                    }}
                >
                    <Sun className="h-3.5 w-3.5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-3.5 w-3.5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="rounded-xl min-w-[120px]"
                style={{
                    background: "rgba(13,13,20,0.96)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                }}
            >
                {[
                    { label: "Light",  value: "light" },
                    { label: "Dark",   value: "dark" },
                    { label: "System", value: "system" },
                ].map((item) => (
                    <DropdownMenuItem
                        key={item.value}
                        onClick={() => setTheme(item.value)}
                        className="text-[12px] text-zinc-400 hover:text-amber-400 rounded-lg cursor-pointer transition-colors"
                    >
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}