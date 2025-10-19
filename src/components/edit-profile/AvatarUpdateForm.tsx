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
import UserAvatar from "../UserAvatar";
import { useUserStore } from "@/stores/userStore";
import { deleteAvatar, setAvatar } from "@/lib/user/actions";

const formSchema = z.object({
  avatar: z.any().optional(),
});

export default function AvatarUpdateForm() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: null,
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(user?.image);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  // Sync form with user when available
  useEffect(() => {
    if (user?.image) {
      form.reset({ avatar: user.image });
      setPreview(user.image);
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    try {
      const res = await setAvatar(values.avatar);

      if (res.success) {
        toast.success(res.message);
        setUser({ image: res.url });
        setSubmitDisabled(true);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemoveAvatar() {
    setSubmitting(true);

    try {
      const res = await deleteAvatar();

      if (res.success) {
        toast.success(res.message);
        setUser({ image: null });
        setSubmitDisabled(true);
        setPreview(null);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Clean up after component unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!user) return;

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

              // Check if file is over 2 MB.
              const max_file_size = 2 * 1024 * 1024;

              if (file.size > max_file_size) {
                toast.error("File size over 2 MB.");
                return;
              }

              // Cleanup previous object URL
              if (preview) {
                URL.revokeObjectURL(preview);
              }

              setPreview(URL.createObjectURL(file));
              setSubmitDisabled(false);
            };

            return (
              <FormItem className="flex items-center gap-7">
                <>
                  <UserAvatar
                    image={preview as string}
                    username={user.displayUsername?.charAt(0) as string}
                    className="size-30"
                    textSize="text-6xl"
                  />

                  <div className="flex-1 flex flex-col gap-2">
                    <FormLabel className="sr-only">Avatar</FormLabel>
                    <FormDescription className="form-description-sm">
                      Upload your Avatar (JPG, PNG or SVG, Maximum Size: 2 MB).
                    </FormDescription>
                    <FormControl>
                      <div className="space-x-2">
                        {user.image && (
                          <Button
                            type="button"
                            onClick={handleRemoveAvatar}
                            disabled={submitting}
                            aria-disabled={submitting}
                          >
                            Remove
                          </Button>
                        )}

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
