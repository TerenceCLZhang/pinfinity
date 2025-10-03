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
import { useState } from "react";
import FormStatusMessage from "./FormStatusMessage";
import { requestPasswordReset } from "@/lib/auth/actions";

const formSchema = z.object({
  email: z.email().trim(),
});

export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    setMessage(null);
    setError(false);

    try {
      const res = await requestPasswordReset({
        email: values.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (res?.errorMessage) {
        setMessage(res.errorMessage);
        setError(true);
      } else {
        setMessage("Check your email for the reset link.");
        setSuccess(true);
      }
    } catch (error) {
      console.error("Form submission error", error);
      setError(true);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return success ? (
    <FormStatusMessage message={message} error={error} />
  ) : (
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
                  placeholder=""
                  type="text"
                  inputMode="email"
                  disabled={submitting}
                  aria-disabled={submitting}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormStatusMessage message={message} error={error} />

        <Button type="submit" disabled={submitting}>
          {submitting ? "Searching..." : "Search"}
        </Button>
      </form>
    </Form>
  );
}
