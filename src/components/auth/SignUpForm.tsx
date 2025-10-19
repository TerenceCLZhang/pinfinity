"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth/actions";
import { useState } from "react";
import { PasswordInput } from "../ui/password-input";
import toast from "react-hot-toast";

const signUpFormSchema = z.object({
  firstName: z.string().min(1, { message: "Required" }).trim(),
  lastName: z.string().min(1, { message: "Required" }).trim(),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long" })
    .max(64, { message: "Username cannot be more than 64 characters long" })
    .refine((s) => !s.includes(" "), "Username cannot contain spaces")
    .trim(),
  email: z.email().trim(),
  password: z.string().min(8, {
    message: "Password is too short.",
  }),
});

export default function SignUpForm() {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    setSubmitting(true);

    try {
      const res = await signUp(values);

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={submitting}
                    aria-disabled={submitting}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    disabled={submitting}
                    aria-disabled={submitting}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormDescription className="form-description-sm">
                Minimum 4 characters and cannot contain spaces.
              </FormDescription>
              <FormControl>
                <Input
                  type="text"
                  disabled={submitting}
                  aria-disabled={submitting}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  disabled={submitting}
                  aria-disabled={submitting}
                  inputMode="email"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormDescription className="form-description-sm">
                Password must contain <b>8 or more</b> letters, numbers, and
                symbols
              </FormDescription>
              <FormControl>
                <PasswordInput
                  disabled={submitting}
                  aria-disabled={submitting}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full mt-2"
          size={"lg"}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
