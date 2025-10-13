"use client";

import { Button } from "@/components/ui/button";
import { Pin } from "@/generated/prisma";
import { useUserStore } from "@/stores/userStore";
import { Download, Edit, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ImageButtons = ({ pin }: { pin: Pin }) => {
  const user = useUserStore((state) => state.user);

  const [numLikes, setNumLikes] = useState(0);

  return (
    <div className="flex gap-5">
      <div>
        <Button
          type="button"
          className="space-x-2 w-fit px-3"
          onClick={() => setNumLikes(numLikes + 1)}
        >
          <ThumbsUp />
          <span>{numLikes}</span>
        </Button>
      </div>

      <a href={pin.image} target="_blank" download>
        <Button type="button" className="space-x-2 w-fit px-3">
          <Download className="w-5 h-5" />
          <span>Download</span>
        </Button>
      </a>
      {user?.id === pin.authorId && (
        <Button asChild>
          <Link href={`/pin/edit/${pin.id}`}>
            <Edit /> <span>Edit</span>
          </Link>
        </Button>
      )}
    </div>
  );
};

export default ImageButtons;
