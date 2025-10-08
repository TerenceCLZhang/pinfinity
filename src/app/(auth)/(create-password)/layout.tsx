import "../../globals.css";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && session.user.username) {
    redirect("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col justify-center items-center shadow-xl border border-secondary p-10 rounded-lg w-125">
        <Link href={"/"} className="mb-5">
          <Image src={"/logo.svg"} alt="" width={75} height={75} />
        </Link>
        {children}
      </div>
    </main>
  );
}
