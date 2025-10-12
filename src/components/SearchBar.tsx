"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="w-[50%] h-full relative">
      <Input
        placeholder="Search..."
        className="w-full pl-5 pr-18 placeholder:font-semibold"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />

      {search && (
        <Button
          type="button"
          variant={"secondary"}
          size={"icon"}
          className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full size-5"
          aria-label="Clear search bar"
          onClick={() => setSearch("")}
        >
          <X />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
