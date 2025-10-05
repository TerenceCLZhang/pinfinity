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
import { useRouter } from "next/navigation";
import FormStatusMessage from "./FormStatusMessage";
import axios from "axios";

const formSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long" })
    .refine((s) => !s.includes(" "), "Username cannot contain spaces")
    .trim(),
});

export default function CreateUsernameForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await axios.post("/api/users/create-username", {
        username: values.username,
      });

      if (res.data.success) {
        router.push("/");
      } else {
        setMessage(res.data.errorMessage || "Something went wrong");
      }
    } catch (error: any) {
      if (error.response?.data?.errorMessage) {
        setMessage(error.response.data.errorMessage);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
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

        <FormStatusMessage message={message} />

        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
