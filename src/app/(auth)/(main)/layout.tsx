import { getSession } from "@/lib/getSession";
import "../../globals.css";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="flex flex-col justify-center items-center shadow-xl border border-secondary p-10 rounded-lg w-125 my-5 xl:my-0">
        <Link href={"/"} className="mb-5">
          <Image src={"/logo.svg"} alt="" width={75} height={75} />
        </Link>
        {children}
      </main>
    </div>
  );
}
