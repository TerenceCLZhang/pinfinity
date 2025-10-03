"use server";

import { APIError } from "better-auth";
import { auth } from "./auth";
import { db } from "../prisma";

export const signUp = async (data: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}) => {
  const { firstName, lastName, username, email, password } = data;

  try {
    await auth.api.signUpEmail({
      body: {
        name: `${firstName} ${lastName}`,
        username,
        email,
        password,
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return { errorMessage: "An account with that email already exists." };

        case "BAD_REQUEST":
          return {
            errorMessage: "Username is already taken. Please try another.",
          };

        case "INTERNAL_SERVER_ERROR":
          return { errorMessage: "Server error. Please try again later." };

        default:
          return {
            errorMessage:
              error.body?.message ||
              "Unexpected error occurred. Please try again.",
          };
      }
    } else {
      return { errorMessage: "Unexpected error occurred. Please try again." };
    }
  }
};

export const logIn = async (data: { email: string; password: string }) => {
  const { email, password } = data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof APIError) {
      switch (error.status) {
        case "UNAUTHORIZED":
          return { errorMessage: "Incorrect email or password." };
        default:
          return {
            errorMessage: "Unexpected error occurred. Please try again.",
          };
      }
    } else {
      return { errorMessage: "Unexpected error occurred. Please try again." };
    }
  }
};

export const requestPasswordReset = async ({
  email,
  redirectTo,
}: {
  email: string;
  redirectTo: string;
}) => {
  try {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return { errorMessage: "Account not found." };
    }

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo,
      },
    });
  } catch (error) {
    console.log(error);
    return { errorMessage: "Something went wrong. Please try again." };
  }
};

export const resetPassword = async (newPassword: string, token: string) => {
  try {
    await auth.api.resetPassword({
      body: {
        newPassword,
        token,
      },
    });
  } catch (error) {
    return { errorMessage: "Something went wrong. Please try again." };
  }
};
