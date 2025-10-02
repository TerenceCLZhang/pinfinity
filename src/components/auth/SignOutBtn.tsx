"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { signOut } from "@/lib/auth/auth-client";

const SignOutBtn = () => {
  const router = useRouter();

  const handleLogOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          window.location.reload();
        },
      },
    });
  };

  return (
    <Button
      type="button"
      size={"lg"}
      className="large-btn cursor-pointer"
      onClick={handleLogOut}
    >
      Log Out
    </Button>
  );
};

export default SignOutBtn;
