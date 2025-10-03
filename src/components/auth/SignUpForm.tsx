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
import FormStatusMessage from "./FormStatusMessage";
import { PasswordInput } from "../ui/password-input";

const signUpFormSchema = z.object({
  firstName: z.string().min(1, { message: "Required" }).trim(),
  lastName: z.string().min(1, { message: "Required" }).trim(),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long" })
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
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    setSubmitting(true);
    setError(false);
    setMessage(null);

    try {
      const res = await signUp(values);

      if (res?.errorMessage) {
        setMessage(res.errorMessage);
        setError(true);
      } else {
        setMessage("A validation link has been sent to your email.");
      }
    } catch (error) {
      console.error("Form submission error", error);
      setMessage("Something went wrong. Please try again.");
      setError(true);
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
              <FormControl>
                <PasswordInput
                  disabled={submitting}
                  aria-disabled={submitting}
                  {...field}
                />
              </FormControl>

              <FormMessage />

              <FormDescription className="text-xs">
                Password must contain <b>8 or more</b> letters, numbers, and
                symbols
              </FormDescription>
            </FormItem>
          )}
        />

        <FormStatusMessage message={message} error={error} />

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
