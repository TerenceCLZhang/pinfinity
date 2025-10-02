import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const inter = Inter({
  variable: "--font-sans-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pinfinity",
  description: "A Pinterest clone made in Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased flex items-center justify-center min-h-screen border`}
      >
        <div className="flex flex-col justify-center items-center shadow-xl border border-secondary p-10 rounded-lg w-125">
          <Link href={"/"} className="mb-5">
            <Image src={"/logo.svg"} alt="" width={75} height={75} />
          </Link>

          {children}
        </div>
      </body>
    </html>
  );
}
