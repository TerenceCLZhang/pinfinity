"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import axios from "axios";
import { User } from "@/generated/prisma";
import LoadingSpinner from "../LoadingSpinner";
import { DialogDescription } from "@radix-ui/react-dialog";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import FollowBtn from "../FollowBtn";
import toast from "react-hot-toast";

const FollowDialog = ({
  num,
  label,
  userId,
  profileId,
}: {
  num: number;
  label: "followers" | "following";
  userId?: string;
  profileId: string;
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false); // prevents duplicate fetches
  const lastRef = useRef(null);

  // Fetch users when page changes or dialog opens
  useEffect(() => {
    if (!open || !profileId || !hasMore || loadingRef.current) return;

    const fetchUsers = async () => {
      setLoading(true);
      loadingRef.current = true;

      try {
        const res = await axios.get(
          `/api/user/${profileId}/${label}?page=${page}`
        );

        const newUsers =
          label === "followers"
            ? res.data.followers || []
            : res.data.following || [];

        setUsers((prev) => [...prev, ...newUsers]);

        if (page >= res.data.totalPages || newUsers.length === 0) {
          setHasMore(false);
        }
      } catch {
        toast.error(`Failed to fetch ${label}`);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    fetchUsers();
  }, [profileId, page, open, hasMore, label]);

  useEffect(() => {
    const target = lastRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [users, hasMore]);

  // Reset when user reopens dialog
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setUsers([]);
      setPage(1);
      setHasMore(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <span>
          {num} <span className="capitalize">{label}</span>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl capitalize">{label}</DialogTitle>
          <DialogDescription className="sr-only">
            {label}&apos;s of this user.
          </DialogDescription>
          <DialogClose />
        </DialogHeader>

        {loading && users.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <div className="max-h-64 overflow-y-auto">
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div>
                <div className="space-y-5">
                  {users.map((user, index) => {
                    const isLast = index === users.length - 1;

                    return (
                      <div
                        key={user.id}
                        className="flex justify-between"
                        ref={isLast ? lastRef : null}
                      >
                        <Link
                          href={`/profile/${user.username}`}
                          className="flex gap-3 items-center hover:opacity-85"
                        >
                          <UserAvatar
                            image={user.image}
                            username={user.username as string}
                            className="size-10"
                            textSize="text-base"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold">{user.name}</span>
                            <span className="text-sm italic">
                              {user.displayUsername}
                            </span>
                          </div>
                        </Link>

                        <div className="mr-2">
                          <FollowBtn userId={userId} profileId={user.id} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Spinner when fetching next page */}
            {hasMore && loadingRef.current && <LoadingSpinner />}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FollowDialog;
