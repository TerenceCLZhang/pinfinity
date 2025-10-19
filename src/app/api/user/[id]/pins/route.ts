import { Prisma } from "@/generated/prisma";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;
  const sort = searchParams.get("sort") || "latest";

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "No ID provided" }, { status: 400 });
  }

  try {
    // Get the order
    const orderBy: Prisma.Enumerable<Prisma.PinOrderByWithRelationInput> =
      sort === "likes"
        ? [{ likeCount: "desc" }, { id: "asc" }]
        : [{ createdAt: "desc" }, { id: "asc" }]; // default to newest

    const pins = await db.pin.findMany({
      where: { authorId: id },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    });

    // Get total count for pagination
    const totalPins = await db.pin.count({ where: { authorId: id } });
    const totalPages = Math.ceil(totalPins / limit);

    return NextResponse.json({ pins, totalPages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
