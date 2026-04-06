"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { CodeIcon, UserIcon, Loader2Icon, CheckIcon } from "lucide-react";

type Role = "candidate" | "interviewer";

const roles = [
    {
        id: "candidate" as Role,
        title: "Candidate",
        description: "I'm here to interview for a position. I'll solve coding problems and showcase my skills.",
        icon: UserIcon,
        perks: ["Join scheduled interviews", "Solve live coding challenges", "Get real-time feedback"],
    },
    {
        id: "interviewer" as Role,
        title: "Interviewer",
        description: "I evaluate candidates. I'll conduct interviews, review code, and provide assessments.",
        icon: CodeIcon,
        perks: ["Schedule & manage interviews", "Review candidate solutions", "Add ratings and comments"],
    },
];

export default function RoleSelection() {
    const { user } = useUser();
    const updateUserRole = useMutation(api.users.updateUserRole);
    const [selected, setSelected] = useState<Role | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = async () => {
        if (!selected || !user?.id) return;
        setIsConfirming(true);
        try {
            await updateUserRole({ clerkId: user.id, role: selected });
        } catch (error) {
            console.error("Failed to set role:", error);
            setIsConfirming(false);
        }
    };

    return (
        <div className="relative h-[calc(100vh-67px)] flex items-center justify-center overflow-hidden p-6">

            {/* animated background orbs */}
            <motion.div
                className="pointer-events-none absolute top-[-100px] left-[20%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.06]"
                style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }}
                animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="pointer-events-none absolute bottom-[-60px] right-[10%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-[0.04]"
                style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.018]"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <div className="relative z-10 w-full max-w-3xl mx-auto">

                {/* header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-10"
                >
                    {/* logo mark */}
                    <div className="flex justify-center mb-5">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{
                                background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.12))",
                                border: "1px solid rgba(251,191,36,0.25)",
                                boxShadow: "0 0 32px rgba(251,191,36,0.15)",
                            }}
                        >
                            <CodeIcon className="size-6 text-amber-400" strokeWidth={2} />
                        </div>
                    </div>

                    <p className="text-[15px] font-bold tracking-[0.22em] mb-2" style={{ color: "rgba(251,191,36,0.60)" }}>
                        One-time setup
                    </p>
                    <h1
                        className="text-4xl font-black tracking-[-0.03em] mb-3"
                        style={{
                            background: "linear-gradient(135deg, #f0f0f4 0%, #a0a0b0 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Choose your role
                        <span style={{
                            background: "linear-gradient(135deg, #fcd34d, #f59e0b)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}>.</span>
                    </h1>
                    <p className="text-[14px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
                        This cannot be changed later. Pick the role that matches how you'll use CodeFront.
                    </p>
                </motion.div>

                
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="grid sm:grid-cols-2 gap-4 mb-6"
                >
                    {roles.map((role, i) => {
                        const isActive = selected === role.id;
                        return (
                            <motion.button
                                key={role.id}
                                onClick={() => setSelected(role.id)}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="relative text-left overflow-hidden rounded-2xl p-6 outline-none"
                                style={{
                                    background: isActive
                                        ? "rgba(251,191,36,0.08)"
                                        : "rgba(255,255,255,0.032)",
                                    backdropFilter: "blur(16px)",
                                    WebkitBackdropFilter: "blur(16px)",
                                    border: isActive
                                        ? "1px solid rgba(251,191,36,0.40)"
                                        : "1px solid rgba(255,255,255,0.07)",
                                    boxShadow: isActive
                                        ? "0 0 40px rgba(251,191,36,0.12), inset 0 1px 0 rgba(255,255,255,0.08)"
                                        : "inset 0 1px 0 rgba(255,255,255,0.05)",
                                    transition: "all 0.25s ease",
                                }}
                            >
                                {/* shimmer top line when active */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            exit={{ scaleX: 0 }}
                                            className="absolute top-0 left-0 right-0 h-[2px] origin-left"
                                            style={{ background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.8) 30%, rgba(252,211,77,0.6) 70%, transparent)" }}
                                        />
                                    )}
                                </AnimatePresence>

                                {/* check badge */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                                            style={{
                                                background: "rgba(251,191,36,0.15)",
                                                border: "1px solid rgba(251,191,36,0.40)",
                                            }}
                                        >
                                            <CheckIcon className="size-3.5 text-amber-400" strokeWidth={2.5} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* icon */}
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                                    style={{
                                        background: isActive ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)",
                                        border: isActive ? "1px solid rgba(251,191,36,0.30)" : "1px solid rgba(255,255,255,0.08)",
                                    }}
                                >
                                    <role.icon
                                        className="size-5 transition-colors duration-200"
                                        style={{ color: isActive ? "#fbbf24" : "rgba(255,255,255,0.35)" }}
                                        strokeWidth={1.8}
                                    />
                                </div>

                                {/* text */}
                                <h3
                                    className="font-bold text-[19px] tracking-[-0.01em] mb-1.5 transition-colors duration-200"
                                    style={{ color: isActive ? "#f0f0f4" : "rgba(255,255,255,0.65)" }}
                                >
                                    {role.title}
                                </h3>
                                <p className="text-[14px] leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                                    {role.description}
                                </p>

                               
                                <ul className="space-y-1.5">
                                    {role.perks.map((perk) => (
                                        <li key={perk} className="flex items-center gap-2 text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                                            <span
                                                className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200"
                                                style={{ background: isActive ? "#fbbf24" : "rgba(255,255,255,0.20)" }}
                                            />
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* confirm button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                >
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.button
                                key="confirm"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                whileHover={{ scale: 1.015 }}
                                whileTap={{ scale: 0.985 }}
                                onClick={handleConfirm}
                                disabled={isConfirming}
                                className="btn-emerald w-full py-3.5 rounded-2xl text-[14px] tracking-wide flex items-center justify-center gap-2"
                            >
                                {isConfirming ? (
                                    <>
                                        <Loader2Icon className="size-4 animate-spin" />
                                        Setting up your account…
                                    </>
                                ) : (
                                    <>
                                        Continue as {selected === "candidate" ? "Candidate" : "Interviewer"} →
                                    </>
                                )}
                            </motion.button>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full py-3.5 rounded-2xl text-[13px] text-center"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    color: "rgba(255,255,255,0.20)",
                                }}
                            >
                                Select a role to continue
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <p className="text-center text-[13px] mt-3" style={{ color: "rgba(255,255,255,0.18)" }}>
                        ⚠ This choice is permanent and cannot be changed after confirmation
                    </p>
                </motion.div>
            </div>
        </div>
    );
}