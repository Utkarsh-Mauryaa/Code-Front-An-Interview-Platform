

import { calculateRecordingDuration } from "@/lib/utils";
import { CallRecording } from "@stream-io/video-react-sdk";
import { format } from "date-fns";
import toast from "react-hot-toast";

function RecordingCard({ recording }: { recording: CallRecording }) {
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(recording.url);
            toast.success("Link copied to clipboard");
        } catch (error) {
            console.log("Error in copying link", error);
            toast.error("Failed to copy link");
        }
    }
    const formattedStartTime = recording.start_time ? format(new Date(recording.start_time), "MMMM d, yyyy, h:mm a") : "Unknown";
    const duration = recording.start_time && recording.end_time ? calculateRecordingDuration(recording.start_time, recording.end_time): "Unknown duration";
  return (
    <div>RecordingCard</div>
  )
}

export default RecordingCard