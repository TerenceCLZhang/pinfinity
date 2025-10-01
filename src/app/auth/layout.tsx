import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({
  variable: "--font-sans-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pinfinity",
  description: "A Pinterest clone made in Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased flex items-center justify-center min-h-screen border`}
      >
        <div className="flex flex-col justify-center items-center shadow-xl border border-secondary p-10 rounded-lg">
          <Link href={"/"} className="mb-5">
            <Image src={"/logo.svg"} alt="" width={75} height={75} />
          </Link>

          {children}
        </div>
      </body>
    </html>
  );
}
