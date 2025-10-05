import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // 1. Check if there is a session (user is logged in)
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "Unauthorized",
        },
        { status: 400 }
      );
    }

    const { username } = await req.json();

    // Check if username is provided and is at least 4 characters long
    if (!username || username.length < 4) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "Invalid username",
        },
        { status: 400 }
      );
    }

    // Check if there exists a user with the same username
    const existingUser = await db.user.findUnique({
      where: {
        username: username.toLowerCase(),
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: "Username already taken",
        },
        { status: 409 }
      );
    }

    // Add the username to the database
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: username.toLowerCase(),
        displayUsername: username,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        errorMessage: "Something went wrong",
      },
      { status: 500 }
    );
  }
};
