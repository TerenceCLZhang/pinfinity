"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FollowBtn from "@/components/profile/FollowBtn";
import Link from "next/link";
import axios from "axios";
import ProfileStats from "./ProfileStats";

interface Props {
  userId: string;
  currentUserId?: string;
  about?: string | null;
}

const ProfileClient = ({ userId, currentUserId, about }: Props) => {
  const [numPins, setNumPins] = useState(0);
  const [numFollowers, setNumFollowers] = useState(0);
  const [numFollowing, setNumFollowing] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get(`/api/user/${userId}/profile-data`);
      const data = res.data;

      setNumPins(data.numPins);
      setNumFollowers(data.numFollowers);
      setNumFollowing(data.numFollowing);
    };

    fetchStats();
  }, [userId]);

  return (
    <>
      <ProfileStats
        numPins={numPins}
        numFollowers={numFollowers}
        numFollowing={numFollowing}
      />

      <p className="whitespace-pre-wrap text-center">{about}</p>

      {currentUserId && currentUserId !== userId && (
        <FollowBtn
          userId={currentUserId}
          profileId={userId}
          onFollowChange={(change) => setNumFollowers((prev) => prev + change)}
        />
      )}

      {currentUserId === userId && (
        <Button type="button" asChild size={"lg"}>
          <Link href="/profile/edit">Edit Profile</Link>
        </Button>
      )}
    </>
  );
};

export default ProfileClient;
