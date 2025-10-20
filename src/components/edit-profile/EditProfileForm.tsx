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
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { updateUser } from "@/lib/user/actions";
import axios from "axios";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "Required" }).trim(),
  lastName: z.string().min(1, { message: "Required" }).trim(),
  about: z.string().trim().optional(),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long" })
    .max(64, { message: "Username cannot be more than 64 characters long" })
    .refine((s) => !s.includes(" "), "Username cannot contain spaces")
    .trim(),
});

export default function EditProfileForm() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      about: "",
      username: "",
    },
    mode: "onChange",
  });

  const { isDirty } = form.formState;

  const [submitting, setSubmitting] = useState(false);

  // Sync form with user when available
  useEffect(() => {
    if (!user) return;

    const setDefault = async () => {
      const nameParts = user.name?.trim().split(/\s+/);
      let about = "";

      try {
        const res = await axios.get(`/api/user/${user?.id}/about`);
        about = res.data;
      } catch {
        toast.error("Failed to fetch About");
      }

      form.reset({
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" "),
        about,
        username: user.displayUsername || "",
      });
    };

    setDefault();
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    try {
      const res = await updateUser(values);

      if (res.success && res.user) {
        toast.success(res.message);
        setUser(res.user);
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto w-full"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
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

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between relative">
                <FormLabel>About</FormLabel>
                <span className="absolute right-3 bottom-1 text-xs">
                  {form.watch("about")?.length} / 800
                </span>
              </div>

              <FormControl>
                <Textarea
                  maxLength={250}
                  disabled={submitting}
                  aria-disabled={submitting}
                  className="resize-none h-25 break-words [word-break:break-word] overflow-y-auto"
                  data-gram="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button type="submit" disabled={submitting || !isDirty} size={"lg"}>
          {submitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
