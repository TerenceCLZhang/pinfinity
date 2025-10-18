"use client";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";

const ProfileStats = ({
  numPins,
  numFollowers,
  numFollowing,
}: {
  numPins: number;
  numFollowers: number;
  numFollowing: number;
}) => {
  return (
    <div className="space-x-5">
      <span>{numPins} Pins</span>

      <Dialog>
        <DialogTrigger>
          <span>{numFollowers} Followers</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
            <DialogClose />
          </DialogHeader>
          Followers
        </DialogContent>
      </Dialog>

      <span>{numFollowing} Following</span>
    </div>
  );
};

export default ProfileStats;
