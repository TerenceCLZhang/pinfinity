"use client";

import FollowDialog from "./FollowDialog";

const ProfileStats = ({
  numPins,
  numFollowers,
  numFollowing,
  userId,
  profileId,
  initialised,
}: {
  numPins: number;
  numFollowers: number;
  numFollowing: number;
  userId?: string;
  profileId: string;
  initialised: boolean;
}) => {
  if (!initialised) return null;

  return (
    <div className="space-x-5">
      <span>{numPins} Pins</span>

      <FollowDialog
        num={numFollowers}
        label="followers"
        userId={userId}
        profileId={profileId}
      />

      <FollowDialog
        num={numFollowing}
        label="following"
        userId={userId}
        profileId={profileId}
      />
    </div>
  );
};

export default ProfileStats;
