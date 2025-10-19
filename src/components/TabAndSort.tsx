"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/stores/userStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Tab {
  label: string;
  value: string;
}

interface TabAndSortProps {
  tabs?: Tab[];
  onChangeTab?: (tab: string) => void;
  onChangeSort: (sort: string) => void;
  activeTab?: string;
  sort?: string;
  currentPath: string;
}

const TabAndSort = ({
  tabs,
  onChangeTab,
  onChangeSort,
  activeTab: initialTabProp,
  sort: initialSortProp,
  currentPath,
}: TabAndSortProps) => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasTabs = !!tabs && tabs.length > 0 && !!user;
  const initialTab = initialTabProp || (hasTabs ? tabs![0].value : "");
  const initialSort = initialSortProp || searchParams.get("sort") || "latest";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    // Callbacks (only if they exist)
    if (hasTabs && onChangeTab) onChangeTab(activeTab);
    onChangeSort(sort);

    // Build URL parameters
    const params = new URLSearchParams();
    if (hasTabs && activeTab && activeTab !== "all") {
      params.set("activeTab", activeTab);
    }

    if (sort !== "latest") params.set("sort", sort);

    // Update URL without reloading
    const queryString = params.toString();

    const url = queryString
      ? `${currentPath}${currentPath.includes("?") ? "&" : "?"}${queryString}`
      : currentPath;

    router.replace(url, { scroll: false });
  }, [
    activeTab,
    sort,
    hasTabs,
    onChangeTab,
    onChangeSort,
    router,
    currentPath,
  ]);

  return (
    <div className="flex justify-between items-center w-full">
      {hasTabs && (
        <div className="space-x-5">
          {tabs!.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`font-semibold ${
                activeTab === tab.value ? "underline-btn-underline" : ""
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <Select value={sort} onValueChange={(value) => setSort(value)}>
        <SelectTrigger className="w-50 ml-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest" className="hover:cursor-pointer">
            Latest First
          </SelectItem>
          <SelectItem value="likes" className="hover:cursor-pointer">
            Most Liked
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TabAndSort;
