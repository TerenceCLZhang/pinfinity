"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth/auth-client";

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
    <Button
      type="button"
      size={"lg"}
      className="header-btn"
      onClick={handleLogOut}
    >
      Log Out
    </Button>
  );
};

export default SignOutBtn;
