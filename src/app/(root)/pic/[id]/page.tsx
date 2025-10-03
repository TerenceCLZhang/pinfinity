import ImageButtons from "@/components/ImageButtons";
import PhotoGrid from "@/components/PhotoGrid";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { ArrowLeft, SendHorizonal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <main className="space-y-20">
      <div className="container flex gap-10">
        <Button
          type="button"
          asChild
          variant={"link"}
          size={"lg"}
          className="size-15"
        >
          <Link href={"/"}>
            <ArrowLeft />
          </Link>
        </Button>

        <div className="border border-secondary shadow-md p-10 rounded-lg w-[45%] flex flex-col gap-5 items-center justify-center self-center">
          <Image
            src={"/test/sample3.jpg"}
            alt="sample"
            width={500}
            height={500}
            unoptimized
            className="w-full h-auto max-h-150 object-contain"
          />
          <ImageButtons />
        </div>

        <div className="flex-1 border border-secondary shadow-md  p-10 rounded-lg flex flex-col gap-5 h-fit self-center max-h-full">
          <h2 className="text-4xl font-bold">Lorem Ipsum</h2>
          <Link href={"#"} className="flex items-center gap-3 hover:opacity-85">
            <Avatar className="size-12 border-2 border-primary">
              <AvatarImage
                src={"/test/sample1.jpg"}
                className="w-full h-full object-cover object-center"
              />
              <AvatarFallback className="self-center mx-auto">
                LI
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-lg">PixelPioneer</span>
          </Link>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio ab
            aperiam voluptas cum quam recusandae esse facilis architecto,
            sapiente nobis id illo ea, rerum vitae deleniti ullam doloribus vero
            aspernatur?
          </p>

          <Separator className="h-0.5 bg-gray-100" />

          <CommentsArea />
        </div>
      </div>

      <PhotoGrid />
    </main>
  );
};

const CommentsArea = () => {
  return (
    <div className="space-y-4">
      <FullComment />
      <div className="relative">
        <label htmlFor="comment-bar" className="sr-only">
          Enter your comment
        </label>
        <Input
          id="comment-bar"
          placeholder="Add a comment"
          className="resize-none w-full break-all py-6 pr-15"
        />
        <Button
          type="button"
          size={"icon"}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <SendHorizonal />
        </Button>
      </div>
    </div>
  );
};

const FullComment = () => {
  return (
    <div className="flex flex-row items-center gap-3">
      <Avatar className="size-12 border-2 border-primary">
        <AvatarImage
          src={"/test/sample4.jpg"}
          className="w-full h-full object-cover object-center"
        />
        <AvatarFallback className="self-center mx-auto">LI</AvatarFallback>
      </Avatar>
      <p>
        <span className="font-bold">QuantumSpoon</span>: Lorem ipsum dolor sit
        amet consectetur, adipisicing elit.
      </p>
    </div>
  );
};

export default Page;
