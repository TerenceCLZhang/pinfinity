"use client";

import { useState } from "react";
import PinGrid from "../PinGrid";
import TabAndSort from "../TabAndSort";

const ProfilePins = ({ id, username }: { id: string; username: string }) => {
  const [activeTab, setActiveTab] = useState("own");
  const [sort, setSort] = useState("latest");

  const endpoint =
    activeTab === "own" ? `/api/user/${id}/pins` : `/api/user/${id}/liked`;

  return (
    <div className="space-y-5">
      <TabAndSort
        tabs={[
          { label: "Pins", value: "own" },
          { label: "Liked", value: "liked" },
        ]}
        activeTab={activeTab}
        sort={sort}
        onChangeTab={setActiveTab}
        onChangeSort={setSort}
        currentPath={`/profile/${username}`}
      />

      <PinGrid endpoint={endpoint} sort={sort} />
    </div>
  );
};

export default ProfilePins;
