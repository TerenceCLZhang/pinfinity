import ImageButtons from "@/components/ImageButtons";
import PinGrid from "@/components/PinGrid";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pin } from "@/generated/prisma";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { ArrowLeft, SendHorizonal } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  let pin: Pin;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pins/${id}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      notFound();
    }

    pin = await res.json();
  } catch (error) {
    notFound();
  }

  return (
    <main className="container space-y-20">
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
          <img
            src={pin.image}
            alt={pin.title}
            className="w-full h-auto max-h-150 object-contain"
          />
          <ImageButtons />
        </div>

        <div className="flex-1 border border-secondary shadow-md  p-10 rounded-lg flex flex-col gap-5 h-fit self-center max-h-full">
          <h2 className="text-4xl font-bold">{pin.title}</h2>
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
          {pin.description && <p>{pin.description}</p>}

          <Separator className="separator" />

          <CommentsArea />
        </div>
      </div>

      <PinGrid />
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
          src={"/test/sample2.jpg"}
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
