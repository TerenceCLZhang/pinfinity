"use server";

import { deleteCommand, putCommand } from "../cloudflare";
import { revalidatePath } from "next/cache";
import { db } from "../prisma";
import { getSession } from "../getSession";

export const createPin = async ({
  image,
  title,
  description,
}: {
  image: File;
  title: string;
  description?: string;
}) => {
  // Check if there is a session
  const session = await getSession();

  if (!session) {
    return { success: false, message: "Unauthorized" };
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

export const deletePin = async ({ id, url }: { id: string; url: string }) => {
  try {
    // Delete image from cloudflare
    let res;
    const filename = url.split("/").pop();

    res = await deleteCommand(`pins/${filename}`);

    if (!res.success) {
      return {
        success: false,
        message: "Could not delete image from Cloudflare.",
      };
    }

    // Delete pin from database
    res = await db.pin.delete({ where: { id } });

    return {
      success: true,
      message: "Pin successfuly deleted.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const editPin = async (
  id: string,
  {
    title,
    description,
  }: {
    title: string;
    description?: string;
  }
) => {
  try {
    const res = await db.pin.update({
      where: { id },
      data: { title, description },
    });

    revalidatePath(`/pin/${id}`);

    return {
      success: true,
      message: "Pin updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
