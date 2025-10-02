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
import FormErrorMessage from "./FormErrorMessage";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.email().min(1, { message: "Required" }).trim(),
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
      }

      router.push("/");
    } catch (error) {
      console.error("Form submission error", error);
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
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  disabled={submitting}
                  aria-disabled={submitting}
                  {...field}
                />
              </FormControl>

              <FormMessage />

              <Link
                href="/auth/forgot-password"
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Forgot your password?
              </Link>
            </FormItem>
          )}
        />

        <FormErrorMessage errorMessage={errorMessage} />

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
