"use client";

import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
  LayoutListIcon,
  UsersIcon,
  PhoneOffIcon,
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  MonitorUpIcon,
  MonitorOffIcon,
  PhoneIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";
import CodeEditor from "./CodeEditor";

// ── Reusable control button ───────────────────────────────────────────────────
function CtrlBtn({
  onClick,
  active = false,
  danger = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.91 }}
      onClick={onClick}
      title={title}
      className="flex items-center justify-center rounded-xl transition-colors duration-200"
      style={{
        width: 42,
        height: 42,
        background: danger
          ? "rgba(239,68,68,0.12)"
          : active
          ? "rgba(251,191,36,0.12)"
          : "rgba(255,255,255,0.06)",
        border: `1px solid ${
          danger
            ? "rgba(239,68,68,0.30)"
            : active
            ? "rgba(251,191,36,0.28)"
            : "rgba(255,255,255,0.09)"
        }`,
        color: danger
          ? "#f87171"
          : active
          ? "#fbbf24"
          : "rgba(255,255,255,0.65)",
      }}
    >
      {children}
    </motion.button>
  );
}

// ── Custom 2-row controls for narrow screens ──────────────────────────────────
function NarrowControls({
  onLeave,
  showParticipants,
  onToggleParticipants,
  layout,
  onSetLayout,
}: {
  onLeave: () => void;
  showParticipants: boolean;
  onToggleParticipants: () => void;
  layout: "grid" | "speaker";
  onSetLayout: (l: "grid" | "speaker") => void;
}) {
  const { useMicrophoneState, useCameraState, useScreenShareState } = useCallStateHooks();

  const { microphone, isMute: micMuted } = useMicrophoneState();
  const { camera, isMute: camOff } = useCameraState();
  const { screenShare, status: screenStatus } = useScreenShareState();
  const isSharingScreen = screenStatus === "enabled";

  const toggleMic    = () => micMuted    ? microphone.enable()  : microphone.disable();
  const toggleCam    = () => camOff      ? camera.enable()      : camera.disable();
  const toggleScreen = async () =>
    isSharingScreen ? await screenShare.disable() : await screenShare.enable();

  return (
    <div
      className="inline-flex flex-col items-center gap-2 rounded-2xl px-4 py-3"
      style={{
        background: "rgba(13,13,20,0.88)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* ── Row 1: mic · cam · screen · participants ── */}
      <div className="flex items-center gap-2">
        <CtrlBtn onClick={toggleMic} active={micMuted} title={micMuted ? "Unmute" : "Mute"}>
          {micMuted
            ? <MicOffIcon  className="size-[18px]" />
            : <MicIcon     className="size-[18px]" />}
        </CtrlBtn>

        <CtrlBtn onClick={toggleCam} active={camOff} title={camOff ? "Start video" : "Stop video"}>
          {camOff
            ? <VideoOffIcon className="size-[18px]" />
            : <VideoIcon    className="size-[18px]" />}
        </CtrlBtn>

        <CtrlBtn onClick={toggleScreen} active={isSharingScreen} title={isSharingScreen ? "Stop sharing" : "Share screen"}>
          {isSharingScreen
            ? <MonitorOffIcon className="size-[18px]" />
            : <MonitorUpIcon  className="size-[18px]" />}
        </CtrlBtn>

        <CtrlBtn onClick={onToggleParticipants} active={showParticipants} title="Participants">
          <UsersIcon className="size-[18px]" />
        </CtrlBtn>
      </div>

      {/* ── Row 2: layout switcher · leave · end call ── */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* wrap in div so asChild doesn't clash with CtrlBtn motion.button */}
            <div>
              <CtrlBtn onClick={() => {}} title="Switch layout">
                <LayoutListIcon className="size-[18px]" />
              </CtrlBtn>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="bg-[#13131e] border-white/10 text-slate-300 rounded-xl mb-2"
          >
            <DropdownMenuItem
              onClick={() => onSetLayout("grid")}
              className={`hover:bg-white/5 hover:text-amber-400 rounded-lg cursor-pointer ${layout === "grid" ? "text-amber-400" : ""}`}
            >
              Grid View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSetLayout("speaker")}
              className={`hover:bg-white/5 hover:text-amber-400 rounded-lg cursor-pointer ${layout === "speaker" ? "text-amber-400" : ""}`}
            >
              Speaker View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <CtrlBtn onClick={onLeave} danger title="Leave call">
          <PhoneIcon className="size-[18px]" />
        </CtrlBtn>

        {/* EndCallButton only shown to interviewer — keep as-is */}
        <EndCallButton />
      </div>
    </div>
  );
}

// ── MeetingRoom ───────────────────────────────────────────────────────────────
function MeetingRoom() {
  const router = useRouter();
  const call = useCall();

  const [layout, setLayout]               = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const [callEnded, setCallEnded]         = useState(false);
  const [isNarrow, setIsNarrow]           = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  // Watch viewport width
  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < 854);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Listen for call ended event
  useEffect(() => {
    if (!call) return;
    const handleCallEnded = () => {
      setCallEnded(true);
      setTimeout(() => router.push("/"), 2500);
    };
    call.on("call.ended", handleCallEnded);
    return () => call.off("call.ended", handleCallEnded);
  }, [call, router]);

  // ── Call ended screen ──
  if (callEnded) {
    return (
      <div className="relative h-[calc(100vh-4rem-1px)] flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
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
              boxShadow: "0 0 40px rgba(251,191,36,0.08)",
            }}
          >
            <PhoneOffIcon className="size-8 text-amber-400/70" strokeWidth={1.4} />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-zinc-200 tracking-tight">Meeting Ended</h1>
            <p className="text-[13px] text-zinc-500">The interviewer has ended this session</p>
          </div>
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[11px] tracking-[0.15em]"
            style={{ color: "rgba(251,191,36,0.40)" }}
          >
            Redirecting you home…
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // ── Joining screen ──
  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-[calc(100vh-4rem-1px)] flex flex-col items-center justify-center gap-4 bg-[#0a0a0f]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="size-7 text-amber-400"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
        <p className="text-[11px] tracking-[0.2em] font-semibold" style={{ color: "rgba(251,191,36,0.45)" }}>
          Joining session…
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-[calc(100vh-4rem-1px)] bg-[#0a0a0f]"
    >
      <ResizablePanelGroup orientation="horizontal" className="h-full">

        {/* ── Video panel ── */}
        <ResizablePanel maxSize={'900px'} minSize={'385px'} className="relative bg-[#0d0d14]">
          <div className="absolute inset-0">
            {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

            <AnimatePresence>
              {showParticipants && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute right-0 top-0 h-full w-[280px] bg-[#0d0d14]/95 backdrop-blur-md border-l border-white/5"
                >
                  <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="absolute bottom-4 left-0 right-0 z-10 flex justify-center px-2"
          >
            {isNarrow ? (
              // ── NARROW (<854px): custom 2-row grid ──
              <NarrowControls
                onLeave={() => router.push("/")}
                showParticipants={showParticipants}
                onToggleParticipants={() => setShowParticipants((v) => !v)}
                layout={layout}
                onSetLayout={setLayout}
              />
            ) : (
              // ── WIDE (≥854px): original single-row layout ──
              <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                <div className="flex items-center gap-2 bg-[#0d0d14]/80 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2">
                  <CallControls onLeave={() => router.push("/")} />
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-10 rounded-xl bg-[#0d0d14]/80 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-amber-400/40 text-slate-300 hover:text-amber-400 transition-all duration-200"
                      >
                        <LayoutListIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#13131e] border-white/10 text-slate-300 rounded-xl">
                      <DropdownMenuItem onClick={() => setLayout("grid")} className="hover:bg-white/5 hover:text-amber-400 rounded-lg cursor-pointer">
                        Grid View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLayout("speaker")} className="hover:bg-white/5 hover:text-amber-400 rounded-lg cursor-pointer">
                        Speaker View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="icon"
                    className={`size-10 rounded-xl backdrop-blur-md border transition-all duration-200 ${
                      showParticipants
                        ? "bg-amber-400/10 border-amber-400/40 text-amber-400"
                        : "bg-[#0d0d14]/80 border-white/10 text-slate-300 hover:bg-white/10 hover:border-amber-400/40 hover:text-amber-400"
                    }`}
                    onClick={() => setShowParticipants(!showParticipants)}
                  >
                    <UsersIcon className="size-4" />
                  </Button>

                  <EndCallButton />
                </div>
              </div>
            )}
          </motion.div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-white/5 hover:bg-amber-400/30 transition-colors duration-200 w-1" />

        {/* ── Code editor panel ── */}
        <ResizablePanel>
          <CodeEditor />
        </ResizablePanel>

      </ResizablePanelGroup>
    </motion.div>
  );
}

export default MeetingRoom;