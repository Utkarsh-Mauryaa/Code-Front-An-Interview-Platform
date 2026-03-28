import { UserCircleIcon } from "lucide-react";
import { Doc } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type User = Doc<"users">;

function UserInfo({ user }: { user: User }) {
    return (
        <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 ring-1 ring-white/10">
                <AvatarImage src={user.image} />
                <AvatarFallback
                    className="text-[10px]"
                    style={{
                        background: "rgba(251,191,36,0.10)",
                        color: "#fbbf24",
                    }}
                >
                    <UserCircleIcon className="h-3.5 w-3.5" />
                </AvatarFallback>
            </Avatar>
            <span className="text-[13px] text-zinc-300">{user.name}</span>
        </div>
    );
}

export default UserInfo;