import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

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
      <body className={`${inter.variable} antialiased min-h-screen`}>
        <NextTopLoader color="#e60023" showSpinner={false} />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
