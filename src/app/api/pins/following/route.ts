import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;

  const session = await auth.api.getSession({ headers: await headers() });

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
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return Response.json({ pins, totalPages });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
