import { auth } from "@/lib/auth/auth";
import cloudinary from "@/lib/cloudinary";
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

    // Get new avatar
    const formData = await req.formData();
    const avatar = formData.get("avatar") as File | null;

    // Check if avatar is present
    if (!avatar) {
      return NextResponse.json(
        { success: false, message: "Avatar not provided." },
        { status: 400 }
      );
    }

    // Upload avatar
    let avatarUrl: string | undefined = undefined;

    const arrayBuffer = await avatar.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadAvatar = await new Promise<cloudinary.UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              folder: "pinfinity-avatars",
              public_id: `${session.user.id}-avatar`,
              resource_type: "image",
            },
            (error, result) => {
              if (error || !result) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(buffer);
      }
    );

    avatarUrl = uploadAvatar.secure_url;

    // Update user in database
    await db.user.update({
      where: { id: session.user.id },
      data: {
        image: avatarUrl ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Avatar successfully changed updated.",
      url: avatarUrl,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
};
