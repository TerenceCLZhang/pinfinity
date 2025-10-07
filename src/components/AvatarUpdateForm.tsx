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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import UserAvatar from "./UserAvatar";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";

const formSchema = z.object({
  avatar: z.any().optional(),
});

export default function AvatarUpdateForm() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.image);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  // Sync form with user when available
  useEffect(() => {
    if (user?.image) {
      form.reset({ avatar: user.image });
      setAvatarPreview(user.image);
    }
  }, [user, form]);

  if (!user) return;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    try {
      const formData = new FormData();
      if (values.avatar) formData.append("avatar", values.avatar);

      const res = await axios.post("/api/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      setUser({ image: res.data.url });
      setSubmitDisabled(true);
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
          name="avatar"
          render={({ field }) => {
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              field.onChange(file);

              if (!file) return;

              const max_file_size = 2 * 1024 * 1024;

              if (file.size > max_file_size) {
                toast.error("File size over 2 MB.");
                return;
              }

              setAvatarPreview(URL.createObjectURL(file));
              setSubmitDisabled(false);
            };

            return (
              <FormItem className="flex items-center gap-7">
                <>
                  <UserAvatar
                    image={avatarPreview as string}
                    username={user.displayUsername?.charAt(0) as string}
                    className="size-30"
                    textSize="text-6xl"
                  />

                  <div className="flex-1 flex flex-col gap-2">
                    <FormLabel className="sr-only">Avatar</FormLabel>
                    <FormDescription className="form-description-sm">
                      Maximum File Size: 2 MB
                    </FormDescription>
                    <FormControl>
                      <div className="space-x-2">
                        <Button
                          asChild
                          type="button"
                          className={`w-fit cursor-pointer ${
                            submitting && "!opacity-50 !pointer-events-none"
                          }`}
                          disabled={submitting}
                          aria-disabled={submitting}
                        >
                          <label>
                            <Input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                              disabled={submitting}
                              aria-disabled={submitting}
                              onChange={handleChange}
                              className="hidden"
                            />
                            Change
                          </label>
                        </Button>

                        <Button
                          type="submit"
                          disabled={submitting || submitDisabled}
                        >
                          {submitting ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </FormControl>
                  </div>
                </>
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
}
