"use client";

import Link from "next/link";
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
import { useState } from "react";
import UserAvatar from "./UserAvatar";
import { useUserStore } from "@/stores/userStore";

const AvatarDropDown = () => {
  const [open, setOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  if (!user) return;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className="hover:opacity-75 rounded-full"
        aria-label="View Account Option"
      >
        <UserAvatar
          username={user?.displayUsername ?? "User"}
          image={user.image}
          className={"size-10"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-40">
        <DropdownMenuLabel className="flex items-center gap-3 mr-10 py-4">
          <UserAvatar
            username={user?.displayUsername ?? "User"}
            image={user.image}
            className={"size-10"}
          />
          <div className="flex flex-col">
            <span>{user.name}</span>
            <span className="italic">@{user.displayUsername}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="hover:bg-secondary"
            onClick={() => setOpen(false)}
          >
            <Link href={`/profile/${user.username}`} className="w-full">
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="hover:bg-secondary"
            onClick={() => setOpen(false)}
          >
            <Link href={"/profile/edit"} className="w-full">
              Edit my Profile
            </Link>
          </DropdownMenuItem>

          <LogOut setOpen={setOpen} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropDown;
