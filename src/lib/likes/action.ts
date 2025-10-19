"use server";

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

    await db.pin.update({
      where: { id: pinId },
      data: { likeCount: { increment: 1 } },
    });

    return { success: true, message: "Successfully liked pin." };
  } catch {
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

    await db.pin.update({
      where: { id: pinId },
      data: { likeCount: { decrement: 1 } },
    });

    return { success: true, message: "Successfully unliked pin." };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
