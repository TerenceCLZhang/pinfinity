import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <header className="container flex items-center justify-between mt-8 h-12 gap-15">
      <div className="flex items-center gap-10 h-full">
        <Link
          href={"/"}
          className="flex items-center gap-2 hover:opacity-85 h-full"
        >
          <Image src={"/logo.svg"} alt="logo" width={35} height={35} />
          <h1 className="text-3xl">Pinfinity</h1>
        </Link>
      </div>

      <SearchBar />

      <div className="space-x-2 h-full">
        <Button asChild size={"lg"} className="text-base h-full">
          <Link href={"/auth/login"}>Log In</Link>
        </Button>

        <Button
          asChild
          variant={"secondary"}
          size={"lg"}
          className="text-base h-full"
        >
          <Link href={"/auth/signup"}>Sign Up</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
