"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { Input } from "../ui/input";

const PinInput = ({
  form,
  submitting,
}: {
  form: UseFormReturn<
    {
      image: any;
      title: string;
      description?: string | undefined;
    },
    any,
    {
      image: any;
      title: string;
      description?: string | undefined;
    }
  >;
  submitting: boolean;
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];

      if (!file) return;

      // Check if image is over 20 MB
      const max_file_size = 2 * 1024 * 1024;

      if (file.size > max_file_size) {
        toast.error(
          "This image is too large and can't be uploaded. Images can't be over 20 MB."
        );
        return;
      }

      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "image/png"
      ) {
        toast.error("File must be a JPG or PNG.");
      }

      if (preview) {
        // Cleanup previous object URL
        URL.revokeObjectURL(preview);
      }

      const url = URL.createObjectURL(file);
      const img = new window.Image();

      img.onload = () => {
        const { width, height } = img;

        // Check if image is at least 200 x 300 pixels
        if (width < 200 || height < 300) {
          toast.error(
            "This image is too small. Images must be at least 200 x 300 pixels."
          );
          URL.revokeObjectURL(url);
          return;
        }

        // If valid, set preview
        setPreview(url);
        form.setValue("image", file);
      };

      img.src = url;
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  // Clean up after component unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Pin</FormLabel>
          <FormDescription className="form-description-sm">
            Upload your Image (JPG or PNG, Maximum Size: 20 MB).
          </FormDescription>
          <FormControl>
            {preview ? (
              <div className="card-border-shadow flex flex-col items-center gap-5">
                <Image
                  src={preview}
                  alt="Uploaded image"
                  width={500}
                  height={500}
                  className="pin-img"
                />

                <div className="space-x-5">
                  <Button
                    type="button"
                    disabled={submitting}
                    aria-disabled={submitting}
                    onClick={() => {
                      URL.revokeObjectURL(preview);
                      setPreview(null);
                      form.setValue("image", null);
                    }}
                  >
                    Remove Image
                  </Button>
                  <Button
                    asChild
                    type="button"
                    className={`w-fit cursor-pointer ${
                      submitting && "!opacity-50 !pointer-events-none"
                    }`}
                  >
                    <label>
                      <Input
                        type="file"
                        disabled={submitting}
                        aria-disabled={submitting}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                      />
                      Change Image
                    </label>
                  </Button>
                </div>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-dashed border-2 p-4 rounded-md text-center cursor-pointer flex items-center justify-center flex-col gap-5 h-100 
                hover:bg-neutral-50 hover:opacity-75 ${
                  isDragActive ? "border-primary" : "border-secondary"
                }`}
              >
                <input
                  {...getInputProps()}
                  accept="image/png, image/jpeg, image/jpg"
                />

                <div className="bg-neutral-200 text-primary p-5 rounded-lg">
                  <Upload />
                </div>

                <p>
                  {isDragActive
                    ? "Drop the file here..."
                    : "Drag & drop a file, or click to select"}
                </p>
              </div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PinInput;
