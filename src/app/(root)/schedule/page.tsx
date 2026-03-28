"use client";

import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import LoaderUI from "@/components/LoaderUI";
import InterviewScheduleUI from "./InterviewScheduleUI";
import { motion } from "framer-motion";

function SchedulePage() {
    const router = useRouter();
    const { isInterviewer, isLoading } = useUserRole();

    if (isLoading) return <LoaderUI />;
    if (!isInterviewer) return router.push("/");

    return (
        <div className="relative min-h-[calc(100vh-68px)] overflow-hidden">

            {/* ── floating animated orbs ── */}
            <motion.div
                className="pointer-events-none absolute top-[-60px] right-[15%] w-[380px] h-[380px] rounded-full blur-[110px] opacity-[0.05]"
                style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }}
                animate={{ y: [0, 25, 0], x: [0, -12, 0] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="pointer-events-none absolute bottom-[5%] left-[8%] w-[260px] h-[260px] rounded-full blur-[80px] opacity-[0.04]"
                style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />

            {/* ── grid ── */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.018]"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <div className="relative z-10">
                <InterviewScheduleUI />
            </div>
        </div>
    );
}

export default SchedulePage;