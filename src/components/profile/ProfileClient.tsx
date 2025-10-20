"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FollowBtn from "@/components/FollowBtn";
import Link from "next/link";
import axios from "axios";
import ProfileStats from "./ProfileStats";
import toast from "react-hot-toast";

interface Props {
  userId?: string;
  profileId: string;
  about?: string | null;
}

const ProfileClient = ({ userId, profileId, about }: Props) => {
  const [numPins, setNumPins] = useState(0);
  const [numFollowers, setNumFollowers] = useState(0);
  const [numFollowing, setNumFollowing] = useState(0);

  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/api/user/${userId}/profile-data`);
        const data = res.data;

        setNumPins(data.numPins);
        setNumFollowers(data.numFollowers);
        setNumFollowing(data.numFollowing);
      } catch {
        toast.error("Failed to fetch profile stats.");
      } finally {
        setInitialised(true);
      }
    };

    fetchStats();
  }, [userId]);

  return (
    <>
      <ProfileStats
        numPins={numPins}
        numFollowers={numFollowers}
        numFollowing={numFollowing}
        userId={userId}
        profileId={profileId}
        initialised={initialised}
      />

      <p className="whitespace-pre-wrap text-center">{about}</p>

      <div className="flex gap-2 md:gap-5">
        {profileId === userId && (
          <Button asChild type="button" size={"lg"}>
            <Link href={"/create"} className="inline-flex items-center gap-2">
              Create Pin
            </Link>
          </Button>
        )}

        {profileId && profileId !== userId && (
          <FollowBtn
            userId={userId}
            profileId={profileId}
            onFollowChange={(change) =>
              setNumFollowers((prev) => prev + change)
            }
            size="lg"
          />
        )}

        {profileId === userId && (
          <Button type="button" asChild size={"lg"}>
            <Link href="/profile/edit">Edit Profile</Link>
          </Button>
        )}
      </div>
    </>
  );
};

export default ProfileClient;
