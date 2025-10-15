import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "No pin ID provided" },
      { status: 400 }
    );
  }

  try {
    const numLikes = await db.like.count({ where: { pinId: id } });

    return NextResponse.json(numLikes);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Server error",
      },
      { status: 500 }
    );
  }
};
