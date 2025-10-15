import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;

  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const likedPins = await db.like.findMany({
      where: { userId: id },
      include: { pin: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    const pins = likedPins.map((like) => like.pin);

    const totalPins = await db.like.count({ where: { userId: id } });
    const totalPages = Math.ceil(totalPins / limit);

    return NextResponse.json({ pins, totalPages });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
