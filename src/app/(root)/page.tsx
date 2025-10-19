"use client";

import PinGrid from "@/components/PinGrid";
import TabAndSort from "@/components/TabAndSort";
import { useSearchParams } from "next/navigation";

import { useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("activeTab") ?? "all"
  );
  const [sort, setSort] = useState(searchParams.get("sort") ?? "latest");

  const endpoint =
    activeTab === "following" ? "/api/pins/following" : "/api/pins";

  return (
    <div className="space-y-5">
      <TabAndSort
        tabs={[
          { label: "All", value: "all" },
          { label: "Following", value: "following" },
        ]}
        activeTab={activeTab}
        sort={sort}
        onChangeTab={setActiveTab}
        onChangeSort={setSort}
        currentPath="/"
      />

      <PinGrid endpoint={endpoint} sort={sort} />
    </div>
  );
}
