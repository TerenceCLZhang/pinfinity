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
      <main className="auth-layout-div">
        <Link href={"/"} className="mb-5">
          <Image src={"/logo.svg"} alt="" width={75} height={75} />
        </Link>
        {children}
      </main>
    </div>
  );
}
