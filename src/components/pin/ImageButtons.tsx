"use client";

import { Button } from "@/components/ui/button";
import { Pin } from "@/generated/prisma";
import { likePin, unlikePin } from "@/lib/likes/action";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { Download, Edit, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ImageButtons = ({ pin }: { pin: Pin }) => {
  const user = useUserStore((state) => state.user);
  const [numLikes, setNumLikes] = useState(pin.likeCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    const hasLikedPin = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`/api/pins/${pin.id}/likes/${user.id}`);
        setHasLiked(res.data.liked);
      } catch {
        toast.error("Failed to fetch whether user liked pin.");
      } finally {
        setInitialised(true);
      }
    };

    // Check if the user has liked the current pin
    hasLikedPin();
  }, [pin.id, user, user?.id]);

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    try {
      const res = await likePin({
        pinId: pin.id,
        userId: user?.id as string,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      setNumLikes((prev) => prev + 1);
      setHasLiked(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleUnlike = async () => {
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    try {
      const res = await unlikePin({
        pinId: pin.id,
        userId: user?.id as string,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      setNumLikes((prev) => prev - 1);
      setHasLiked(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex gap-5">
      <div>
        {initialised && (
          <Button
            type="button"
            className="space-x-2 w-fit px-3"
            onClick={hasLiked ? handleUnlike : handleLike}
          >
            <ThumbsUp fill={hasLiked ? "#fff" : "none"} />
            {numLikes}
          </Button>
        )}
      </div>

      <a href={pin.image} target="_blank" download>
        <Button type="button" className="space-x-2 w-fit px-3">
          <Download className="w-5 h-5" />
          Download
        </Button>
      </a>
      {user?.id === pin.authorId && (
        <Button asChild>
          <Link href={`/pin/edit/${pin.id}`}>
            <Edit /> Edit
          </Link>
        </Button>
      )}
    </div>
  );
};

export default ImageButtons;
