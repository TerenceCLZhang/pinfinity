import { Prisma } from "@/generated/prisma";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { query: string } }
) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;
  const sort = searchParams.get("sort") || "latest";

  const { query } = await params;
  const wordList = query.split(" ");

  // Check if a search query was provided
  if (!query) {
    return NextResponse.json(
      { message: "No search query provided" },
      { status: 400 }
    );
  }

  try {
    // Get the order
    const orderBy: Prisma.Enumerable<Prisma.PinOrderByWithRelationInput> =
      sort === "likes"
        ? [{ likeCount: "desc" }, { id: "asc" }]
        : [{ createdAt: "desc" }, { id: "asc" }]; // default to newest

    // Retrieve all pins where all query words are either in the title or description
    const pins = await db.pin.findMany({
      where: {
        AND: wordList.flatMap((word) => ({
          OR: [
            { title: { contains: word, mode: "insensitive" } },
            { description: { contains: word, mode: "insensitive" } },
          ],
        })),
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    });

    // Get total count for pagination
    const totalPins = await db.pin.count({
      where: {
        AND: wordList.flatMap((word) => ({
          OR: [
            { title: { contains: word, mode: "insensitive" } },
            { description: { contains: word, mode: "insensitive" } },
          ],
        })),
      },
    });
    const totalPages = Math.ceil(totalPins / limit);

    return Response.json({ pins, totalPages }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
};
