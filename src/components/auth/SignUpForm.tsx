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
import FormErrorMessage from "./FormErrorMessage";
import { useRouter } from "next/navigation";
import ShowPasswordBtn from "./ShowPasswordBtn";

const signUpFormSchema = z.object({
  firstName: z.string().min(1, { message: "Required" }).trim(),
  lastName: z.string().min(1, { message: "Required" }).trim(),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long" })
    .refine((s) => !s.includes(" "), "Password cannot contain spaces")
    .trim(),
  email: z.email().min(1, { message: "Required" }).trim(),
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewPassword, setViewPassword] = useState(false);

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await signUp(values);

      if (res?.errorMessage) {
        setErrorMessage(res.errorMessage);
      }

      router.push("/");
    } catch (error) {
      console.error("Form submission error", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-3xl mx-auto w-full"
      >
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
                <Input
                  type={viewPassword ? "text" : "password"}
                  disabled={submitting}
                  aria-disabled={submitting}
                  className="pr-10"
                  {...field}
                />
              </FormControl>

              <ShowPasswordBtn
                viewPassword={viewPassword}
                setViewPassword={setViewPassword}
                submitting={submitting}
              />

              <FormMessage />

              <FormDescription className="text-xs">
                Password must contain <b>8 or more</b> letters, numbers, and
                symbols
              </FormDescription>
            </FormItem>
          )}
        />

        <FormErrorMessage errorMessage={errorMessage} />

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
