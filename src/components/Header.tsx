import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import AvatarDropDown from "./AvatarDropDown";
import { PlusIcon } from "lucide-react";

const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="container fixed bg-white top-0 py-8 z-100 w-full flex items-center justify-between gap-15">
      <div className="flex items-center gap-10 h-full">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-85 h-full"
        >
          <Image
            src="/logo.svg"
            alt="logo"
            width={35}
            height={35}
            className="align-middle"
          />
          <h1 className="text-3xl leading-none">Pinfinity</h1>
        </Link>
      </div>

      <SearchBar />

      <div className="space-x-2 h-full">
        {session ? (
          <div className="h-full flex flex-row items-center gap-5">
            <Button asChild type="button" size={"lg"}>
              <Link href={"/create"} className="inline-flex items-center gap-2">
                <PlusIcon /> Create
              </Link>
            </Button>
            <AvatarDropDown />
          </div>
        ) : (
          <>
            <Button asChild type="button" size={"lg"}>
              <Link href={"/login"}>Log In</Link>
            </Button>

            <Button asChild type="button" variant={"secondary"} size={"lg"}>
              <Link href={"/signup"}>Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
