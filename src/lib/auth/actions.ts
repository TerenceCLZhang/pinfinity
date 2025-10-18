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

    return {
      success: true,
      message: "A validation link has been sent to your email.",
    };
  } catch (error) {
    console.error(error);

    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return {
            success: false,
            message: "An account with that email already exists.",
          };

        case "BAD_REQUEST":
          return {
            success: false,
            message: "Username is already taken. Please try another.",
          };

        case "INTERNAL_SERVER_ERROR":
          return {
            success: false,
            message: "Server error. Please try again later.",
          };

        default:
          return {
            success: false,
            message:
              error.body?.message ||
              "Unexpected error occurred. Please try again.",
          };
      }
    } else {
      return {
        success: false,
        message: "Unexpected error occurred. Please try again.",
      };
    }
  }
};

export const logIn = async (data: {
  email: string;
  password: string;
  remember: boolean;
}) => {
  const { email, password, remember } = data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: remember,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);

    if (error instanceof APIError) {
      switch (error.status) {
        case "UNAUTHORIZED":
          return {
            success: false,
            message: "Incorrect email or password.",
          };
        default:
          return {
            success: false,
            message: "Unexpected error occurred. Please try again.",
          };
      }
    } else {
      return {
        success: false,
        message: "Unexpected error occurred. Please try again.",
      };
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
      return { success: false, message: "Account not found." };
    }

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo,
      },
    });

    return { success: true, message: "Check your email for the reset link." };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
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

    return {
      success: true,
      message:
        "Password reset. You will automatically be brought to the login page in 5 seconds.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
