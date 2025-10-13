"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import PinGrid from "../PinGrid";

const ProfilePins = ({ id }: { id: string }) => {
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

      {current == 0 ? <MyPins id={id} /> : <MyLiked id={id} />}
    </div>
  );
};

const MyPins = ({ id }: { id: string }) => {
  // try {
  //   const res = await axios.get(`/api/pins/get-all-user/${id}`);
  // } catch (error) {
  //   toast.error("Something went wrong fetching user's pins.");
  // }

  return <PinGrid />;
};

const MyLiked = ({ id }: { id: string }) => {
  return <div>MyLiked</div>;
};

export default ProfilePins;
