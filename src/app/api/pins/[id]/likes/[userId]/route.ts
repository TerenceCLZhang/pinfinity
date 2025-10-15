import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { id: string; userId: string } }
) => {
  const { id, userId } = await params;

  if (!id || !userId) {
    return NextResponse.json(
      { message: "Missing pin ID and/or user ID" },
      { status: 400 }
    );
  }

  try {
    const liked = await db.like.findUnique({
      where: {
        pinId_userId: {
          pinId: id,
          userId,
        },
      },
    });

    return NextResponse.json({ liked: !!liked });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
