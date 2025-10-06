"use client";

import { authClient } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Dispatch, SetStateAction } from "react";

const SignOutBtn = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleLogOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload();
        },
      },
    });
  };

  return (
    <DropdownMenuItem
      className="hover:bg-secondary cursor-pointer"
      onClick={() => {
        handleLogOut();
        setOpen(false);
      }}
    >
      Log Out
    </DropdownMenuItem>
  );
};

export default SignOutBtn;
