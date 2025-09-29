import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center">
      <header className="container flex items-center justify-between mt-5 h-12 gap-15">
        <div className="flex items-center gap-10 h-full">
          <Link
            href={"/"}
            className="flex items-center gap-2 hover:opacity-85 h-full"
          >
            <Image src={"logo.svg"} alt="logo" width={35} height={35} />
            <h1>Pinfinity</h1>
          </Link>
        </div>

        <div className="flex-1 h-full">
          <Input
            placeholder="Search..."
            className="w-full h-full px-5 placeholder:font-semibold hover:bg-gray-100"
          />
        </div>

        <div className="space-x-5 h-full">
          <Button
            asChild
            size={"lg"}
            className="text-base h-full hover:bg-red-700"
          >
            <Link href={"#"}>Log In</Link>
          </Button>

          <Button
            asChild
            variant={"secondary"}
            size={"lg"}
            className="text-base h-full hover:bg-neutral-200"
          >
            <Link href={"#"}>Sign Up</Link>
          </Button>
        </div>
      </header>
    </div>
  );
}
