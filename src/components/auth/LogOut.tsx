"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";

const SignOutBtn = () => {
  const router = useRouter();

  const handleLogOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          window.location.reload();
        },
      },
    });
  };

  return (
    <DropdownMenuItem
      className="hover:bg-secondary cursor-pointer"
      onClick={handleLogOut}
    >
      Log Out
    </DropdownMenuItem>
  );
};

export default SignOutBtn;
