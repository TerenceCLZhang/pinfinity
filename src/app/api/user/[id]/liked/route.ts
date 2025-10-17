import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "No ID provided" }, { status: 400 });
  }

  try {
    const likedPins = await db.like.findMany({
      where: { userId: id },
      include: { pin: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const pins = likedPins.map((like) => like.pin);

    // Get total count for pagination
    const totalPins = await db.like.count({ where: { userId: id } });
    const totalPages = Math.ceil(totalPins / limit);

    return NextResponse.json({ pins, totalPages });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
