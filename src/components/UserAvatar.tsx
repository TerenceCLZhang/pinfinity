import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const UserAvatar = ({
  user,
}: {
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined | undefined;
    username?: string | null | undefined;
    displayUsername?: string | null | undefined;
  };
}) => {
  return (
    <Button
      asChild
      type="button"
      className="bg-transparent hover:bg-transparent hover:opacity-75"
    >
      <Link href={`/profile/${user.username}`}>
        <Avatar className="size-11">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className="bg-primary text-xl">
            {user.displayUsername?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </Link>
    </Button>
  );
};

export default UserAvatar;
