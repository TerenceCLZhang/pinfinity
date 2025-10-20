"use client";

import { Search, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { DialogClose } from "@radix-ui/react-dialog";

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <>
      {isMobile ? (
        <div>
          <Drawer direction="top" open={open} onOpenChange={setOpen}>
            <DrawerTrigger className="flex items-center">
              <Search />
            </DrawerTrigger>
            <DrawerContent className="p-5">
              <DrawerHeader>
                <DrawerTitle className="text-2xl inline-flex items-center justify-center gap-2">
                  <Search /> Search
                </DrawerTitle>
                <DrawerDescription className="sr-only">
                  Search for pins
                </DrawerDescription>
                <DialogClose className="absolute right-5">
                  <X />
                </DialogClose>
              </DrawerHeader>

              <div className="m-5 mt-0 relative">
                <SearchBarInput setOpen={setOpen} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      ) : (
        <div className="w-full lg:w-[45%] xl:w-[50%] h-full relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden sm:block">
            <Search className="size-5" />
          </div>
          <SearchBarInput setOpen={setOpen} />
        </div>
      )}
    </>
  );
};

const SearchBarInput = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search/?q=${search.trim()}`);
    if (setOpen) setOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <Input
          id="searchbar"
          placeholder="Search..."
          className="w-full md:pl-12 pr-18 placeholder:font-semibold"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {search && (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full size-5"
          aria-label="Clear search bar"
          onClick={() => {
            setSearch("");
            document.getElementById("searchbar")?.focus();
          }}
        >
          <X />
        </Button>
      )}
    </>
  );
};

export default SearchBar;
