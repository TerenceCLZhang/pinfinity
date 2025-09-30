import PhotoGrid from "@/components/PhotoGrid";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ArrowLeft, Download, MessageSquareMore, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <main className="space-y-20">
      <div className="container flex gap-10">
        <Button asChild variant={"link"} size={"lg"} className="size-15">
          <Link href={"/"}>
            <ArrowLeft />
          </Link>
        </Button>
        <div className="bg-gray-100 p-10 rounded-lg w-[45%] h-fit flex flex-col gap-5 items-center justify-center self-center">
          <Image
            src={"/test/sample3.jpg"}
            alt="sample"
            width={350}
            height={350}
            className="mx-auto"
          />
          <div className="flex gap-5">
            <Button className="space-x-2">
              <ThumbsUp />
              <span>5</span>
            </Button>
            <Button>
              <MessageSquareMore />
            </Button>
            <Button>
              <Download />
            </Button>
            <Button>Save</Button>
          </div>
        </div>
        <div className="flex-1 bg-gray-100  p-10 rounded-lg flex flex-col gap-10 h-fit self-center max-h-full">
          <h2 className="text-4xl font-bold">Dolores Costello</h2>
          <div className="flex items-center gap-3">
            <Avatar className="size-15">
              <AvatarImage
                src={"/test/sample.jpg"}
                className="w-full h-full object-cover object-center"
              />
              <AvatarFallback>DC</AvatarFallback>
            </Avatar>
            <span className="">Sample UserName</span>
          </div>
          <p>
            Dolores Costello (1903–1979) was a famed silent film actress, known
            as the "Goddess of the Silent Screen," and grandmother of Drew
            Barrymore.
          </p>
          <div>
            <div>comment</div>
            <div>
              <Input placeholder="Add a comment" />
            </div>
          </div>
        </div>
      </div>

      <PhotoGrid />
    </main>
  );
};

export default Page;
