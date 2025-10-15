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
  const [numLikes, setNumLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (!pin?.id || !user?.id) return; // Don't run if data not ready

    // Get the number of likes for the current pin
    const fetchNumLikes = async () => {
      try {
        const res = await axios.get(`/api/pins/likes/${pin.id}`);
        setNumLikes(res.data);
      } catch (error) {
        console.error("Failed to fetch likes:", error);
      }
    };

    // Check if the user has liked the current pin
    const hasLikedPost = async () => {
      try {
        const res = await axios.get(
          `/api/pins/likes/has-liked?pinId=${pin.id}&userId=${user.id}`
        );
        setHasLiked(res.data.liked);
      } catch (error) {
        console.log("Failed to fetch whether user liked pin:", error);
      }
    };

    fetchNumLikes();
    hasLikedPost();
  }, [pin.id, user?.id]);

  const handleLike = async () => {
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
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleUnlike = async () => {
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
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex gap-5">
      <div>
        <Button
          type="button"
          className="space-x-2 w-fit px-3"
          onClick={hasLiked ? handleUnlike : handleLike}
        >
          <ThumbsUp fill={hasLiked ? "#fff" : "none"} />
          {numLikes}
        </Button>
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
