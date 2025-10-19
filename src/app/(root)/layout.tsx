import "../globals.css";
import Header from "@/components/header/Header";
import { redirect } from "next/navigation";
import SessionSync from "@/components/SessionSync";
import { getSession } from "@/lib/getSession";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  // Ask user to create username if they are logged in and have no username
  if (session && !session.user.username) {
    redirect("/create-username");
  }

  return (
    <div className="flex flex-col items-center gap-15 min-h-screen">
      <SessionSync user={session?.user}>
        <Header />
        <main className="container p-8 mt-25">{children}</main>
      </SessionSync>
    </div>
  );
}
