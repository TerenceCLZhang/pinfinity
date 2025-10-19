"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search/?q=${search.trim()}`);
  };

  return (
    <div className="w-[50%] h-full relative">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5" />

      <form onSubmit={handleSearch}>
        <Input
          id="searchbar"
          placeholder="Search..."
          className="w-full pl-12 pr-18 placeholder:font-semibold"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </form>

      {search && (
        <Button
          type="button"
          variant={"secondary"}
          size={"icon"}
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
    </div>
  );
};

export default SearchBar;
