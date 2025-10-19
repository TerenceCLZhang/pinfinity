import { Prisma } from "@/generated/prisma";
import { getSession } from "@/lib/getSession";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;
  const sort = searchParams.get("sort") || "latest";

  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Find all users current user is following
    const followedUsers = await db.follow.findMany({
      where: { followerId: userId },
      select: { followeeId: true },
    });

    const followedIds = followedUsers.map((f) => f.followeeId);

    if (followedIds.length === 0) {
      return Response.json({ pins: [], totalPages: 0 });
    }

    // Get total count for pagination
    const totalPins = await db.pin.count({
      where: { authorId: { in: followedIds } },
    });
    const totalPages = Math.ceil(totalPins / limit);

    // Get the order
    const orderBy: Prisma.Enumerable<Prisma.PinOrderByWithRelationInput> =
      sort === "likes"
        ? [{ likeCount: "desc" }, { id: "asc" }]
        : [{ createdAt: "desc" }, { id: "asc" }]; // default to newest

    // Fetch paginated pins
    const pins = await db.pin.findMany({
      where: {
        authorId: { in: followedIds },
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

    return Response.json({ pins, totalPages });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
