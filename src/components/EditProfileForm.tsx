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
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "Required" }).trim(),
  lastName: z.string().min(1, { message: "Required" }).trim(),
  about: z.string().optional(),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long" })
    .refine((s) => !s.includes(" "), "Username cannot contain spaces")
    .trim(),
  email: z.email().trim(),
});

export default function EditProfileForm() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  let defaultValues = {
    firstName: "",
    lastName: "",
    about: "",
    username: "",
    email: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const { isDirty } = form.formState;

  const [submitting, setSubmitting] = useState(false);

  // Sync form with user when available
  useEffect(() => {
    if (!user) return;

    const nameParts = user.name?.trim().split(/\s+/);

    defaultValues = {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(" "),
      about: user.about || "",
      username: user.displayUsername || "",
      email: user.email || "",
    };

    form.reset(defaultValues);
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("about", values.about || "");

      const res = await axios.post("/api/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      setUser(res.data.user);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response.data.message || "Something went wrong. Please try again."
      );
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
              <FormLabel>About</FormLabel>
              <FormDescription className="form-description-sm">
                Maximum Length: 250 Characters
              </FormDescription>
              <FormControl>
                <div className="relative">
                  <Textarea
                    maxLength={250}
                    disabled={submitting}
                    aria-disabled={submitting}
                    className="resize-none h-25 break-all"
                    data-gram="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                    {...field}
                  />
                  <span className="absolute right-3 bottom-1 text-xs">
                    {form.watch("about")?.length} / 250
                  </span>
                </div>
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

        <div className="flex gap-2">
          <Button
            type="button"
            size={"lg"}
            disabled={submitting || !isDirty}
            variant={"secondary"}
            onClick={() => {
              form.reset(defaultValues);
            }}
          >
            Reset
          </Button>
          <Button type="submit" disabled={submitting || !isDirty} size={"lg"}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
