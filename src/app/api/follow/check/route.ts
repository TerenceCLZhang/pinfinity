import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const followerId = searchParams.get("followerId");
  const followeeId = searchParams.get("followeeId");

  if (!followerId || !followeeId) {
    return NextResponse.json({ message: "Missing user IDs" }, { status: 400 });
  }

  try {
    const follow = await db.follow.findUnique({
      where: {
        followerId_followeeId: {
          followerId,
          followeeId,
        },
      },
    });

    return NextResponse.json({ isFollowing: !!follow });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
