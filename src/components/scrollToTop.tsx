"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const scrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scroll({ top: 0, left: 0 });
  }, [pathname]);

  return null;
};

export default scrollToTop;
