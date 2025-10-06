"use server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";

// Used for Social Auth sign ups
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

export const updateProfile = async ({
  data,
}: {
  data: {
    firstName: string;
    lastName: string;
    about?: string;
    username: string;
    email: string;
  };
}) => {
  const { firstName, lastName, about, username, email } = data;

  // Check if there is a session
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  // Check if all required fields are filled
  if (!firstName || !lastName || !username || !email) {
    return { success: false, message: "All required fields must have data." };
  }

  // Check if username is already taken
  const existingUsername = await db.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (existingUsername && existingUsername.id !== session.user.id) {
    return { success: false, message: "Username is already taken" };
  }

  // Check if email is already used
  const existingEmail = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingEmail && existingEmail.id !== session.user.id) {
    return { success: false, message: "Email is already in use" };
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: `${firstName} ${lastName}`,
        username: username.toLowerCase(),
        displayUsername: username,
        email,
        about,
      },
    });

    return { success: true, message: "Successfully updated." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
