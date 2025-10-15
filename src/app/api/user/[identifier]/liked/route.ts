import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { identifier: string } }
) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;

  const { identifier } = await params;

  if (!identifier) {
    return NextResponse.json(
      { message: "No identifier provided" },
      { status: 400 }
    );
  }

  try {
    let likedPins;

    if (/^[A-Za-z0-9]{32}$/.test(identifier)) {
      likedPins = await db.like.findMany({
        where: { userId: identifier },
        include: { pin: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      return NextResponse.json(
        { message: "Identifier must be the user ID" },
        { status: 400 }
      );
    }

    const pins = likedPins.map((like) => like.pin);

    const totalPins = await db.like.count({ where: { userId: identifier } });
    const totalPages = Math.ceil(totalPins / limit);

    return NextResponse.json({ pins, totalPages });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
