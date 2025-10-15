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
    let pins;

    if (/^[A-Za-z0-9]{32}$/.test(identifier)) {
      pins = await db.pin.findMany({
        where: { authorId: identifier },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
    } else {
      return NextResponse.json(
        { message: "Identifier must be the user ID" },
        { status: 400 }
      );
    }

    const totalPins = await db.pin.count();
    const totalPages = Math.ceil(totalPins / limit);

    return NextResponse.json({ pins, totalPages }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
