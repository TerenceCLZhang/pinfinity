"use client";

import { useState } from "react";

const ProfilePins = () => {
  const [current, setCurrent] = useState(0);

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

      {current == 0 ? <MyPins /> : <MyLiked />}
    </div>
  );
};

const MyPins = () => {
  return <div>MyPins</div>;
};

const MyLiked = () => {
  return <div>MyLiked</div>;
};

export default ProfilePins;
