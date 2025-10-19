"use client";

import { useState } from "react";
import PinGrid from "../PinGrid";
import TabAndSort from "../TabAndSort";
import { useSearchParams } from "next/navigation";

const OtherPostsGrid = ({
  pinId,
  authorId,
}: {
  pinId: string;
  authorId: string;
}) => {
  const searchParams = useSearchParams();

  const [sort, setSort] = useState(searchParams.get("sort") ?? "latest");

  return (
    <div className="space-y-5">
      <TabAndSort
        sort={sort}
        onChangeSort={setSort}
        currentPath={`/pin/${pinId}`}
      />

      <PinGrid endpoint={`/api/user/${authorId}/pins`} sort={sort} />
    </div>
  );
};

export default OtherPostsGrid;
