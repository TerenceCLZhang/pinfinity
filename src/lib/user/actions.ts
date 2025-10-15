"use server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { putCommand, deleteCommand } from "../cloudflare";
import { revalidatePath } from "next/cache";

export const setUsername = async (username: string) => {
  // Check if there is a session
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  // Check if a username is provided and is at least four characters long
  if (!username || username.length < 4) {
    return { success: false, message: "Invalid username" };
  }

  // Check if there already exists a user with the desired username
  const existingUser = await db.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (existingUser) {
    return { success: false, message: "Username is already taken" };
  }

  try {
    // Set the username for the signed up user
    await db.user.update({
      where: { id: session.user.id },
      data: {
        username: username.toLowerCase(),
        displayUsername: username,
      },
    });

    return { success: true, message: "Username successfully created." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const setAvatar = async (avatar: File) => {
  // Check if there is a session
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  // Check if avatar provided
  if (!avatar) {
    return { success: false, message: "No file provided" };
  }

  try {
    // Upload to Cloudflare R2
    const res = await putCommand(avatar, `/avatar/${session.user.id}-avatar`);

    if (!res.success) {
      return {
        success: false,
        message: "Could not upload avatar to Cloudflare.",
      };
    }

    // Update database
    await db.user.update({
      where: { id: session.user.id },
      data: { image: res.url },
    });

    revalidatePath(`/profile/${session.user.username}`);

    return {
      success: true,
      message: "Avatar updated successfully.",
      url: res.url,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const deleteAvatar = async () => {
  // Check if there is a session
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // Delete from Cloudflare R2
    const res = await deleteCommand(`avatar/${session.user.id}-avatar`);

    if (!res.success) {
      return {
        success: false,
        message: "Could not delete avatar from Cloudflare.",
      };
    }

    // Update database
    await db.user.update({
      where: { id: session.user.id },
      data: { image: null },
    });

    revalidatePath(`/profile/${session.user.username}`);

    return {
      success: true,
      message: "Avatar successfully removed.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const updateUser = async ({
  firstName,
  lastName,
  username,
  email,
  about,
}: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  about?: string | undefined;
}) => {
  // Check if there is a session
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // Check for duplicate username
    const existingUsername = await db.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (existingUsername && existingUsername.id !== session.user.id) {
      return { success: false, message: "Username is already taken." };
    }

    // Check for duplicate email
    const existingEmail = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail && existingEmail.id !== session.user.id) {
      return { success: false, message: "Email is already in use" };
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

    revalidatePath(`/profile/${session.user.username}`);

    return {
      success: true,
      message: "Successfully updated.",
      user: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
