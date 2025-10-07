import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Check if there is a valid session
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await req.formData();
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const about = formData.get("about") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;

    if (!firstName || !lastName || !username || !email) {
      return NextResponse.json(
        { success: false, message: "All required fields must have data." },
        { status: 400 }
      );
    }

    // Check for duplicate username
    const existingUsername = await db.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (existingUsername && existingUsername.id !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Username is already taken." },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingEmail = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail && existingEmail.id !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Email is already in use" },
        { status: 400 }
      );
    }

    // Update user in database
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: `${firstName} ${lastName}`,
        username: username.toLowerCase(),
        displayUsername: username,
        email,
        about,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully updated.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
};
