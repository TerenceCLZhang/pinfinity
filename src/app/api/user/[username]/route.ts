import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { username: string } }
) => {
  const { username } = await params;

  if (!username) {
    return NextResponse.json(
      { message: "No username provided" },
      { status: 400 }
    );
  }

  try {
    const user = await db.user.findUnique({ where: { username } });

    if (!user) {
      return NextResponse.json(
        { message: "User does not exist." },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
};
