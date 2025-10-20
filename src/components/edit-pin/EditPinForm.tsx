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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { editPin } from "@/lib/pins/actions";

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Required" })
    .max(64, { message: "Title cannot be more than 128 characters long" })
    .trim(),
  description: z
    .string()
    .max(800, {
      message: "Description cannot be more than 800 characters long",
    })
    .trim()
    .optional(),
});

export default function EditPinForm({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description?: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      description,
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    try {
      const res = await editPin(id, values);

      if (res.success) {
        toast.success(res.message);
        router.push(`/pin/${id}`);
      } else {
        toast.error(res.message);
        setSubmitting(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mx-auto w-full flex gap-10 items-center"
      >
        <div className="space-y-5 w-full">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    disabled={submitting}
                    aria-disabled={submitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between relative">
                  <FormLabel>Description</FormLabel>
                  <span className="absolute right-3 bottom-1 text-xs">
                    {form.watch("description")?.length} / 800
                  </span>
                </div>

                <FormControl>
                  <Textarea
                    className="resize-none h-45 break-words [word-break:break-word] overflow-y-auto"
                    {...field}
                    disabled={submitting}
                    aria-disabled={submitting}
                    data-gram="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                    maxLength={800}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size={"lg"} disabled={submitting}>
            {submitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
