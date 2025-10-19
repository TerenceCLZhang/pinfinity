"use client";

import { useState } from "react";
import TabAndSort from "../TabAndSort";
import PinGrid from "../PinGrid";
import { useSearchParams } from "next/navigation";

const SearchPinGrid = ({ q }: { q: string }) => {
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("activeTab") ?? "all"
  );
  const [sort, setSort] = useState(searchParams.get("sort") ?? "latest");

  const endpoint =
    activeTab === "following"
      ? `/api/pins/search/${q}/following`
      : `/api/pins/search/${q}`;

  return (
    <div className="space-y-4">
      <TabAndSort
        tabs={[
          { label: "All", value: "all" },
          { label: "Following", value: "following" },
        ]}
        activeTab={activeTab}
        sort={sort}
        onChangeTab={setActiveTab}
        onChangeSort={setSort}
        currentPath={`/search?q=${q}`}
      />

      <PinGrid endpoint={endpoint} sort={sort} search={q} />
    </div>
  );
};

export default SearchPinGrid;
