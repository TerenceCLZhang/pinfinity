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
    return NextResponse.json(
      { message: "No identifier provided" },
      { status: 400 }
    );
  }

  try {
    const pins = await db.pin.findMany({
      where: { authorId: id },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const totalPins = await db.pin.count({ where: { authorId: id } });
    const totalPages = Math.ceil(totalPins / limit);

    return NextResponse.json({ pins, totalPages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
