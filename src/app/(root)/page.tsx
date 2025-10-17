"use client";

import PinGrid from "@/components/PinGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/stores/userStore";
import { useState } from "react";

export default function Home() {
  const user = useUserStore((state) => state.user);
  const [current, setCurrent] = useState(0);

  const endpoint = current === 0 ? "/api/pins" : "/api/pins/following";

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        {user && (
          <div className="space-x-5">
            <button
              type="button"
              className={`font-semibold ${
                current == 0 && "underline-btn-underline "
              }`}
              onClick={() => setCurrent(0)}
            >
              All
            </button>
            <button
              type="button"
              className={`font-semibold ${
                current == 1 && "underline-btn-underline "
              }`}
              onClick={() => setCurrent(1)}
            >
              Following
            </button>
          </div>
        )}

        <Select defaultValue="newest">
          <SelectTrigger className="w-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest" className="hover:cursor-pointer">
              Newest First
            </SelectItem>
            <SelectItem value="most-liked" className="hover:cursor-pointer">
              Most Liked
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PinGrid endpoint={endpoint} />
    </div>
  );
}
