"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { putCommand } from "../cloudflare";
import { db } from "../prisma";

export const CreatePin = async ({
  image,
  title,
  description,
}: {
  image: File;
  title: string;
  description?: string;
}) => {
  // Check if there is a session
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  // Check if image and title are present
  if (!image || !title) {
    return { success: false, message: "Pin does not have image and/or title." };
  }

  try {
    // Upload to Cloudflare R2
    const res = await putCommand(
      image,
      `pins/${session.user.id}-${Date.now()}`
    );

    if (!res.success || !res.url) {
      return {
        success: false,
        message: "Could not upload image to Cloudflare.",
      };
    }

    // Create new pin in the database
    const pin = await db.pin.create({
      data: {
        image: res.url,
        title,
        description,
        authorId: session.user.id,
      },
    });

    return {
      success: true,
      message: "Pin created successfully.",
      pin,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
