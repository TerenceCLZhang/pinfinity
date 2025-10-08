"use client";

import { authClient } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Dispatch, SetStateAction } from "react";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";

const SignOutBtn = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const clearUser = useUserStore((state) => state.clearUser);

  const router = useRouter();

  const handleLogOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          clearUser();
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
