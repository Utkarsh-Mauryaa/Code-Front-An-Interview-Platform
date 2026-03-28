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
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="container max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-white">Recordings</h1>
          <p className="text-slate-500 mt-1 text-sm">
            {recordings.length} {recordings.length === 1 ? "recording" : "recordings"} available
          </p>
        </motion.div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
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