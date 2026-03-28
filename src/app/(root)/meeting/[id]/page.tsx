"use client";

import LoaderUI from "@/components/LoaderUI";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import useGetCallById from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { VideoOffIcon } from "lucide-react";

function MeetingPage() {
    const { id } = useParams();
    const { isLoaded } = useUser();
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const { call, isCallLoading } = useGetCallById(id);

    if (!isLoaded || isCallLoading) return <LoaderUI />;

    if (!call) {
        return (
            <div className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
                {/* animated orb */}
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04] pointer-events-none"
                    style={{ background: "radial-gradient(circle, #fbbf24, transparent)" }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex flex-col items-center gap-5 text-center"
                >
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{
                            background: "rgba(251,191,36,0.07)",
                            border: "1px solid rgba(251,191,36,0.15)",
                        }}
                    >
                        <VideoOffIcon className="size-9 text-amber-400/60" strokeWidth={1.4} />
                    </div>
                    <div className="space-y-1.5">
                        <h1 className="text-2xl font-bold text-zinc-200 tracking-tight">Meeting Not Found</h1>
                        <p className="text-[13px] text-zinc-600">This session may have ended or the link is invalid</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <StreamCall call={call}>
            <StreamTheme>
                <div className={isSetupComplete ? "block" : "hidden"}>
                    <MeetingRoom />
                </div>
                <div className={isSetupComplete ? "hidden" : "block"}>
                    <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
                </div>
            </StreamTheme>
        </StreamCall>
    );
}

export default MeetingPage;