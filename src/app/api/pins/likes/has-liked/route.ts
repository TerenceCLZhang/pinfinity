import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const pinId = searchParams.get("pinId");
  const userId = searchParams.get("userId");

  if (!pinId || !userId) {
    return NextResponse.json(
      { message: "Missing pin ID and/or user ID" },
      { status: 400 }
    );
  }

  try {
    const liked = await db.like.findUnique({
      where: {
        pinId_userId: {
          pinId,
          userId,
        },
      },
    });

    return NextResponse.json({ liked: !!liked });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
