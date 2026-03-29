"use client";

import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CameraIcon, MicIcon, SettingsIcon, VideoOffIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
    const [disableCamera, setDisableCamera] = useState(true);
    const [disableMic, setDisableMic] = useState(false);
    const call = useCall();

    useEffect(() => {
        if (!call) return;
        if (disableCamera) call.camera.disable();
        else call.camera.enable();
    }, [disableCamera]);

    useEffect(() => {
        if (!call) return;
        if (disableMic) call.microphone.disable();
        else call.microphone.enable();
    }, [disableMic]);

    if (!call) return null;

    const handleJoin = async () => {
        await call.join();
        onSetupComplete();
    };

    return (
        <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-68px)] bg-[#0a0a0f] flex items-center justify-center p-4 sm:p-6">
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-amber-400/3 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/3 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-[1100px] mx-auto relative">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
                >
                    {/* Camera Preview Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="bg-[#13131e] border border-white/8 rounded-2xl p-4 sm:p-6 flex flex-col"
                    >
                        <div className="mb-3 sm:mb-4">
                            <h1 className="text-base sm:text-lg font-semibold text-white">Camera Preview</h1>
                            <p className="text-xs text-slate-500 mt-0.5">Make sure you look good!</p>
                        </div>

                        
                        <div className="flex-1 min-h-[200px] sm:min-h-[300px] md:min-h-[360px] rounded-xl overflow-hidden bg-[#0d0d14] border border-white/8 relative">
                            <style>{`
                                .str-video__video-preview-container,
                                .str-video__video-preview-container > div {
                                    width: 100% !important;
                                    height: 100% !important;
                                }
                            `}</style>
                            <VideoPreview className="absolute inset-0 h-full w-full" />

                            {disableCamera && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3 bg-[#0d0d14]">
                                    <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/8">
                                        <VideoOffIcon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500" />
                                    </div>
                                    <p className="text-xs text-slate-500">Camera is turned off</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Settings Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="bg-[#13131e] border border-white/8 rounded-2xl p-4 sm:p-6 flex flex-col"
                    >
                        <div className="mb-4 sm:mb-6">
                            <h2 className="text-base sm:text-lg font-semibold text-white">Meeting Details</h2>
                            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 break-all font-mono">{call.id}</p>
                        </div>

                        <div className="flex-1 flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                                {/* Camera Toggle */}
                                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-[#0a0a0f] border border-white/8 hover:border-white/12 transition-colors">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center transition-colors ${!disableCamera ? "bg-amber-400/10" : "bg-white/5"}`}>
                                            <CameraIcon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${!disableCamera ? "text-amber-400" : "text-slate-500"}`} />
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-white">Camera</p>
                                            <p className="text-[10px] sm:text-xs text-slate-500">{disableCamera ? "Off" : "On"}</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={!disableCamera}
                                        onCheckedChange={(checked) => setDisableCamera(!checked)}
                                        className="data-[state=checked]:bg-amber-400"
                                    />
                                </div>

                                {/* Mic Toggle */}
                                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-[#0a0a0f] border border-white/8 hover:border-white/12 transition-colors">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center transition-colors ${!disableMic ? "bg-amber-400/10" : "bg-white/5"}`}>
                                            <MicIcon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${!disableMic ? "text-amber-400" : "text-slate-500"}`} />
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-white">Microphone</p>
                                            <p className="text-[10px] sm:text-xs text-slate-500">{disableMic ? "Off" : "On"}</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={!disableMic}
                                        onCheckedChange={(checked) => setDisableMic(!checked)}
                                        className="data-[state=checked]:bg-amber-400"
                                    />
                                </div>

                                {/* Device Settings */}
                                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-[#0a0a0f] border border-white/8 hover:border-white/12 transition-colors">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-white/5 flex items-center justify-center">
                                            <SettingsIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-white">Settings</p>
                                            <p className="text-[10px] sm:text-xs text-slate-500">Configure devices</p>
                                        </div>
                                    </div>
                                    <DeviceSettings />
                                </div>
                            </div>

                            {/* Join Button */}
                            <div className="space-y-2 sm:space-y-3">
                                <Button
                                    className="w-full h-10 sm:h-11 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold transition-all duration-200 shadow-lg shadow-amber-400/20 text-sm"
                                    onClick={handleJoin}
                                >
                                    Join Meeting
                                </Button>
                                <p className="text-[10px] sm:text-xs text-center text-slate-600">
                                    Our team is rooting for you — good luck! 🎉
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default MeetingSetup;