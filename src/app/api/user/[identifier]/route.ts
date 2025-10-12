import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { identifier: string } }
) => {
  const { identifier } = await params;

  if (!identifier) {
    return NextResponse.json(
      { message: "No identifier provided" },
      { status: 400 }
    );
  }

  try {
    let user;

    if (/^[A-Za-z0-9]{32}$/.test(identifier)) {
      user = await db.user.findUnique({ where: { id: identifier } });
    } else {
      user = await db.user.findUnique({ where: { username: identifier } });
    }

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
