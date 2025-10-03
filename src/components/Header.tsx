import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import SignOutBtn from "./auth/SignOutBtn";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import UserAvatar from "./UserAvatar";

const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
        {session ? (
          <div className="h-full flex flex-row items-center">
            <Button type="button" size={"lg"} className="header-btn">
              <Link href={"/create"}>Create</Link>
            </Button>
            <UserAvatar user={session.user} />
            <SignOutBtn />
          </div>
        ) : (
          <>
            <Button asChild type="button" size={"lg"} className="header-btn">
              <Link href={"/login"}>Log In</Link>
            </Button>

            <Button
              asChild
              type="button"
              variant={"secondary"}
              size={"lg"}
              className="header-btn"
            >
              <Link href={"/signup"}>Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
