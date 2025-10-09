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
import PinInput from "./PinInput";
import { CreatePin } from "@/lib/pins/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  image: z.any(),
  title: z
    .string()
    .min(1, { message: "Required" })
    .max(64, { message: "Title cannot be more than 128 characters long" }),
  description: z
    .string()
    .max(800, {
      message: "Description cannot be more than 800 characters long",
    })
    .optional(),
});

export default function CreatePinForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: null,
      title: "",
      description: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    try {
      const res = await CreatePin(values);

      if (res.success) {
        toast.success("Pin created successfully.");
        router.push("/");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mx-auto w-full flex gap-10 items-center"
      >
        <div className="flex-1">
          <PinInput form={form} submitting={submitting} />
        </div>

        <div className="flex-1 space-y-5">
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      className="resize-none h-45 break-all"
                      {...field}
                      disabled={submitting}
                      aria-disabled={submitting}
                      data-gram="false"
                      data-gramm_editor="false"
                      data-enable-grammarly="false"
                      maxLength={800}
                    />
                    <span className="absolute right-3 bottom-1 text-xs">
                      {form.watch("description")?.length} / 800
                    </span>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size={"lg"}
            disabled={form.watch("image") === null || submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
