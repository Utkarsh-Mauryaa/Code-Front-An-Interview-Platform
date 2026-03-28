"use client";

import LoaderUI from "@/components/LoaderUI";
import RecordingCard from "@/components/RecordingCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetCalls } from "@/hooks/useGetCalls";
import { CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { VideoIcon } from "lucide-react";

function RecordingsPage() {
  const { calls, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!calls) return;
      try {
        const callData = await Promise.all(calls.map((call) => call.queryRecordings()));
        const allRecordings = callData.flatMap((call) => call.recordings);
        setRecordings(allRecordings);
      } catch (error) {
        console.log("Error in fetching recordings", error);
      }
    };
    fetchRecordings();
  }, [calls]);

  if (isLoading) return <LoaderUI />;

  return (
    // overflow-hidden stops the page itself from scrolling
    <div className="h-[calc(100vh-70px)] flex flex-col overflow-hidden">

      {/* Header — fixed height, never scrolls */}
      <div className="container max-w-7xl mx-auto px-6 pt-10 pb-4 shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white">Recordings</h1>
          <p className="text-slate-500 mt-1 text-[17px]">
            {recordings.length} {recordings.length === 1 ? "recording" : "recordings"} available
          </p>
        </motion.div>
      </div>

      {/* ScrollArea takes all remaining height — only this scrolls */}
      <div className="flex-1 overflow-hidden container max-w-7xl mx-auto px-6">
        <ScrollArea className="h-full">
          {recordings.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-6"
            >
              {recordings.map((r, i) => (
                <motion.div
                  key={r.end_time}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <RecordingCard recording={r} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center h-[400px] gap-4"
            >
              <div className="p-4 rounded-2xl bg-[#13131e] border border-white/8">
                <VideoIcon className="size-8 text-slate-500" />
              </div>
              <p className="text-slate-500 text-sm">No recordings available yet</p>
            </motion.div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

export default RecordingsPage;