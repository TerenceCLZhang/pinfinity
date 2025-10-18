import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "No identifier provided" },
      { status: 400 }
    );
  }

  try {
    const [numPins, numFollowers, numFollowing] = await Promise.all([
      db.pin.count({ where: { authorId: id } }),
      db.follow.count({ where: { followeeId: id } }),
      db.follow.count({ where: { followerId: id } }),
    ]);

    return NextResponse.json({ numPins, numFollowers, numFollowing });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
