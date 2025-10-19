"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { followUser, unfollowUser } from "@/lib/user/actions";
import axios from "axios";

const FollowBtn = ({
  userId,
  profileId,
  onFollowChange,
  size = "default",
}: {
  userId?: string;
  profileId: string;
  onFollowChange?: (change: number) => void;
  size?: "default" | "lg" | "sm" | "icon";
}) => {
  if (!userId || userId === profileId) return <></>;

  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(false);
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      try {
        const res = await axios.get(
          `/api/follow/check?followerId=${userId}&followeeId=${profileId}`
        );
        setFollowing(res.data.isFollowing);
      } catch {
        toast.error("Failed to check follow status.");
      } finally {
        setInitialised(true);
      }
    };

    checkFollowing();
  }, [profileId]);

  const handleFollow = async () => {
    setLoading(true);

    try {
      const res = await followUser({
        followerId: userId,
        followeeId: profileId,
      });

      if (res.success) {
        setFollowing(true);
        if (onFollowChange) onFollowChange(1);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setLoading(true);

    try {
      const res = await unfollowUser({
        followerId: userId,
        followeeId: profileId,
      });

      if (res.success) {
        setFollowing(false);
        if (onFollowChange) onFollowChange(-1);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!initialised) return null;

  return (
    <Button
      type="button"
      size={size}
      variant={following ? "secondary" : "default"}
      onClick={following ? handleUnfollow : handleFollow}
      disabled={loading}
    >
      {following ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowBtn;
