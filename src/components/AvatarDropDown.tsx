import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import LogOut from "./auth/LogOut";

const AvatarDropDown = ({
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
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:opacity-75 rounded-full">
        <UserAvatar
          username={user?.displayUsername ?? "User"}
          image={user.image ?? ""}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center gap-3 mr-10 py-4">
          <UserAvatar
            username={user?.displayUsername ?? "User"}
            image={user.image ?? ""}
          />
          <div className="flex flex-col">
            <span>{user.name}</span>
            <span className="italic">@{user.displayUsername}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:bg-secondary">
            <Link href={`/profile/${user.username}`} className="w-full">
              My Profile
            </Link>
          </DropdownMenuItem>
          <LogOut />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserAvatar = ({
  username,
  image,
}: {
  username: string;
  image: string;
}) => {
  return (
    <Avatar className="size-10">
      <AvatarImage src={image} className="object-cover" />
      <AvatarFallback className="bg-primary text-xl text-white">
        {username.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarDropDown;
