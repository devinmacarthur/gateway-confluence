import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types/database";

interface ProfileCardProps {
  profile: Profile;
  showRole?: boolean;
}

export function ProfileCard({ profile, showRole = false }: ProfileCardProps) {
  const initials = profile.display_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-7 w-7">
        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{profile.display_name}</span>
      {showRole && profile.role !== "member" && (
        <Badge variant="secondary" className="text-[10px]">
          {profile.role}
        </Badge>
      )}
    </div>
  );
}
