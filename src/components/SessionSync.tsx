"use client";

import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

interface SessionUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  username?: string | null;
  displayUsername?: string | null;
}

const SessionSync = ({
  user,
  children,
}: {
  user?: SessionUser | null;
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
