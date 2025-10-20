"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "../ui/drawer";
import { MenuIcon, X } from "lucide-react";
import { DialogHeader } from "../ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

const LogInSignOutBtns = () => {
  const isLargeScreen = useMediaQuery("(min-width: 1000px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  return isLargeScreen ? (
    <>
      <Button asChild type="button" size={"lg"}>
        <Link href={"/login"}>Log In</Link>
      </Button>
      <Button asChild type="button" variant={"secondary"} size={"lg"}>
        <Link href={"/signup"}>Sign Up</Link>
      </Button>
    </>
  ) : (
    <Drawer direction="right">
      <DrawerTrigger>
        <MenuIcon />
      </DrawerTrigger>
      <DrawerContent>
        <DialogHeader>
          <DialogTitle className="sr-only">Menu</DialogTitle>
          <DialogDescription className="sr-only">
            Log in or sign in to Pinfinity
          </DialogDescription>
          <DrawerClose className="absolute top-5 right-5">
            <X className="size-10" />
          </DrawerClose>
        </DialogHeader>

        <div className="flex flex-col gap-5 text-xl pt-20 pl-5 md:pl-10 md:text-3xl md:gap-7">
          <Link href={"/login"}>Log In</Link>
          <Link href={"/signup"}>Sign Up</Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default LogInSignOutBtns;
