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
      where: { followeeId: id },
      select: {
        follower: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const followers = res.map((f) => f.follower);

    // Get total count for pagination
    const totalFollowers = await db.follow.count({ where: { followeeId: id } });
    const totalPages = Math.ceil(totalFollowers / limit);

    return NextResponse.json({ followers, totalPages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
