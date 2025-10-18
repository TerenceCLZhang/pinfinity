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
import { useRouter } from "next/navigation";
import { PasswordInput } from "../ui/password-input";
import toast from "react-hot-toast";
import { Checkbox } from "../ui/checkbox";

const formSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(1, { message: "Required" }),
  remember: z.boolean(),
});

export default function LogInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    try {
      const res = await logIn(values);

      if (res.success) {
        router.push("/");
      } else {
        toast.error(res.message || "Log in failed.");
        setSubmitting(false);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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

        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start mt-8">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Remember me</FormLabel>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />

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
