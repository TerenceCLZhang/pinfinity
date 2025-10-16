"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { db } from "../prisma";

export const likePin = async ({
  pinId,
  userId,
}: {
  pinId: string;
  userId: string;
}) => {
  try {
    await db.like.create({
      data: {
        pinId,
        userId,
      },
    });

    return { success: true, message: "Successfully liked pin." };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export const unlikePin = async ({
  pinId,
  userId,
}: {
  pinId: string;
  userId: string;
}) => {
  try {
    await db.like.delete({
      where: {
        pinId_userId: {
          pinId,
          userId,
        },
      },
    });

    return { success: true, message: "Successfully unliked pin." };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
