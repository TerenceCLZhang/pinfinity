"use client";

import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/lib/auth/actions";
import { useUserStore } from "@/stores/userStore";
import { useState } from "react";
import toast from "react-hot-toast";

const UpdateProfileResetPasswordBtn = () => {
  const user = useUserStore((state) => state.user);

  const [disabled, setDisabled] = useState(false);

  if (!user) return;

  const handleClick = async () => {
    setDisabled(true);

    try {
      const res = await requestPasswordReset({
        email: user.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDisabled(false);
    }
  };

  return (
    <Button type="button" size={"lg"} onClick={handleClick} disabled={disabled}>
      {disabled ? "Sending Reset Email..." : "Reset Password"}
    </Button>
  );
};

export default UpdateProfileResetPasswordBtn;
