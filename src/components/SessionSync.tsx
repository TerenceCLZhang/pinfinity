"use client";

import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

const SessionSync = ({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) => {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return <>{children}</>;
};

export default SessionSync;
