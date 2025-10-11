import { auth } from "@/lib/auth/auth";
import "../globals.css";
import Header from "@/components/Header";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SessionSync from "@/components/SessionSync";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Ask user to create username if they are logged in and have no username
  if (session && !session.user.username) {
    redirect("/create-username");
  }

  return (
    <div className="flex flex-col items-center justify-center gap-15 min-h-screen">
      <SessionSync user={session?.user}>
        <Header />
        <div className="p-8">{children}</div>
      </SessionSync>
    </div>
  );
}
