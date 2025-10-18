import { Prisma } from "@/generated/prisma";
import { getSession } from "@/lib/getSession";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ query: string }> }
) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;
  const sort = searchParams.get("sort") || "latest";
  const { query } = await params;
  const wordList = query.split(" ");

  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Get followed users
    const followedUsers = await db.follow.findMany({
      where: { followerId: userId },
      select: { followeeId: true },
    });
    const followedIds = followedUsers.map((f) => f.followeeId);

    if (followedIds.length === 0) {
      return NextResponse.json({ pins: [], totalPages: 0 });
    }

    // Define sorting
    const orderBy: Prisma.Enumerable<Prisma.PinOrderByWithRelationInput> =
      sort === "likes"
        ? [{ likeCount: "desc" }, { id: "asc" }]
        : [{ createdAt: "desc" }, { id: "asc" }];

    // Build Prisma-compliant filter
    const searchConditions: Prisma.PinWhereInput = {
      AND: wordList.map((word) => ({
        OR: [
          { title: { contains: word, mode: "insensitive" } },
          { description: { contains: word, mode: "insensitive" } },
        ],
      })),
    };

    // Fetch pins
    const pins = await db.pin.findMany({
      where: {
        authorId: { in: followedIds },
        ...searchConditions,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    });

    // Count total pins for pagination
    const totalPins = await db.pin.count({
      where: {
        authorId: { in: followedIds },
        ...searchConditions,
      },
    });

    const totalPages = Math.ceil(totalPins / limit);

    return NextResponse.json({ pins, totalPages }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
