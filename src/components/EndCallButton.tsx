import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { PhoneOffIcon } from "lucide-react";

function EndCallButton() {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const updateInterviewStatus = useMutation(api.interviews.updateInterviewStatus);
  const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
    streamCallId: call?.id || "",
  });

  if (!call) return null;

  const isMeetingOwner = localParticipant?.userId === call?.state?.createdBy?.id;

  // Only the creator sees this — works for both instant calls and scheduled interviews
  if (!isMeetingOwner) return null;

  const endCall = async () => {
    try {
      await call.endCall();

      // Only update status if this is a scheduled interview (has a Convex record)
      if (interview) {
        await updateInterviewStatus({ id: interview._id, status: "completed" });
      }

      router.push("/");
      toast.success("Meeting ended for everyone!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to end meeting!");
    }
  };

  return (
    <Button
      onClick={endCall}
      className="h-10 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all duration-200 gap-2 text-sm font-medium"
    >
      <PhoneOffIcon className="size-4" />
      End Call
    </Button>
  );
}

export default EndCallButton;