import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const UserAvatar = ({
  image,
  username,
  className,
  textSize = "text-xl",
}: {
  image: string | null;
  username: string;
  className?: string;
  textSize?: string;
}) => {
  return (
    <Avatar key={image ?? "fallback"} className={className}>
      <AvatarImage src={image || undefined} className="object-cover" />
      <AvatarFallback className={`bg-primary text-white ${textSize}`}>
        {username.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
