import Image from "next/image";
import Link from "next/link";
import SearchAndButtons from "./SearchAndButtons";

const Header = async () => {
  return (
    <header className="fixed w-full bg-white top-0 py-8 z-40">
      <div className="container px-8 flex items-center justify-between mx-auto gap-5 md:gap-15">
        <div className="flex items-center gap-10 h-full">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-85 h-10"
          >
            <div className="relative h-full aspect-square">
              <Image
                src="/logo.svg"
                alt="logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="sr-only lg:not-sr-only text-3xl leading-none h-full flex items-center">
              Pinfinity
            </h1>
          </Link>
        </div>

        <SearchAndButtons />
      </div>
    </header>
  );
};

export default Header;
