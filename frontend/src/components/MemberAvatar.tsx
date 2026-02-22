import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface MemberAvatarProps {
  name?: string | null
  image?: string | null
  size?: "sm" | "default" | "lg"
  className?: string
  fallbackClassName?: string
}

export function MemberAvatar({
  name,
  image,
  size,
  className,
  fallbackClassName,
}: MemberAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {image && <AvatarImage src={image} alt={name || undefined} />}
      <AvatarFallback className={fallbackClassName}>
        {name ? getInitials(name) : "?"}
      </AvatarFallback>
    </Avatar>
  )
}
