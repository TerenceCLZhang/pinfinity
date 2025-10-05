"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { logIn } from "@/lib/auth/actions";
import { useState } from "react";
import FormStatusMessage from "./FormStatusMessage";
import { useRouter } from "next/navigation";
import { PasswordInput } from "../ui/password-input";

const formSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(1, { message: "Required" }),
});

export default function LogInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await logIn(values);

      if (res?.errorMessage) {
        setErrorMessage(res.errorMessage);
      } else {
        router.push("/");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
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

              <Link
                href="/forgot-password"
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Forgot your password?
              </Link>
            </FormItem>
          )}
        />

        <FormStatusMessage message={errorMessage} />

        <Button
          type="submit"
          disabled={submitting}
          className="w-full mt-2"
          size={"lg"}
        >
          {submitting ? "Submitting..." : "Log In"}
        </Button>
      </form>
    </Form>
  );
}
