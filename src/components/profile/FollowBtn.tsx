"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { followUser, unfollowUser } from "@/lib/user/actions";
import axios from "axios";

const FollowBtn = ({
  userId,
  profileId,
  onFollowChange,
}: {
  userId?: string;
  profileId: string;
  onFollowChange: (change: number) => void;
}) => {
  if (!userId || userId === profileId) return <></>;

  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      const res = await axios.get(
        `/api/follow/check?followerId=${userId}&followeeId=${profileId}`
      );

      setFollowing(res.data.isFollowing);
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
        onFollowChange(1);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
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
        onFollowChange(-1);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size={"lg"}
      onClick={following ? handleUnfollow : handleFollow}
      disabled={loading}
    >
      {following ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowBtn;
