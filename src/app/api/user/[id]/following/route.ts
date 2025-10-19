import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "No ID provided" }, { status: 400 });
  }

  try {
    const res = await db.follow.findMany({
      where: { followerId: id },
      select: {
        followee: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const followees = res.map((f) => f.followee);

    // Get total count for pagination
    const totalFollowees = await db.follow.count({ where: { followerId: id } });
    const totalPages = Math.ceil(totalFollowees / limit);

    return NextResponse.json(
      { following: followees, totalPages },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
