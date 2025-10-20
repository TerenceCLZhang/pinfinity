"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import LogInSignOutBtns from "./LogInSignOutBtns";
import SearchBar from "./SearchBar";
import AvatarDropDown from "./AvatarDropDown";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import Link from "next/link";

const SearchAndButtons = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return isMobile ? (
    <div className="flex items-center gap-5">
      <SearchBar />
      <Buttons />
    </div>
  ) : (
    <>
      <SearchBar />
      <Buttons />
    </>
  );
};

const Buttons = () => {
  const user = useUserStore((state) => state.user);

  return (
    <div className="space-x-2 h-full flex items-center">
      {user ? (
        <div className="h-full flex flex-row items-center gap-5">
          <div className="hidden lg:block">
            <Button asChild type="button" size={"lg"}>
              <Link href={"/create"} className="inline-flex items-center gap-2">
                <PlusIcon /> Create
              </Link>
            </Button>
          </div>

          <AvatarDropDown />
        </div>
      ) : (
        <LogInSignOutBtns />
      )}
    </div>
  );
};

export default SearchAndButtons;
