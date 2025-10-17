"use client";

import { useState } from "react";
import PinGrid from "../PinGrid";

const ProfilePins = ({ id }: { id: string }) => {
  const [current, setCurrent] = useState(0);

  const endpoint =
    current === 0 ? `/api/user/${id}/pins` : `/api/user/${id}/liked`;

  return (
    <div className="flex flex-col items-center justify-center gap-15">
      <div className="space-x-5">
        <button
          type="button"
          className={`font-semibold ${
            current == 0 && "underline-btn-underline "
          }`}
          onClick={() => setCurrent(0)}
        >
          Pins
        </button>
        <button
          type="button"
          className={`font-semibold ${
            current == 1 && "underline-btn-underline "
          }`}
          onClick={() => setCurrent(1)}
        >
          Liked
        </button>
      </div>

      <PinGrid endpoint={endpoint} />
    </div>
  );
};

export default ProfilePins;
