import ProfilePins from "@/components/profile/ProfilePins";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { User } from "@/generated/prisma";
import { auth } from "@/lib/auth/auth";

import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: { username: string } }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  let user: User;

  const { username } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${username}`,
      { next: { revalidate: 900 } }
    );

    if (!res.ok) {
      notFound();
    }

    user = await res.json();
  } catch (error) {
    notFound();
  }

  return (
    <section className="container flex flex-col gap-10">
      <div className="flex flex-col items-center gap-4">
        <UserAvatar
          image={user.image}
          username={user.displayUsername as string}
          className="size-40"
          textSize="text-8xl"
        />
        <div className="text-center space-y-2">
          <h2 className="text-4xl">{user.name}</h2>
          <span className="text-sm italic">@{user.displayUsername}</span>
        </div>

        <p className="whitespace-pre-wrap text-center">{user.about}</p>

        {session?.user.id === user.id && (
          <Button type="button" asChild size={"lg"}>
            <Link href={"/profile/edit"}>Edit Profile</Link>
          </Button>
        )}
      </div>

      <ProfilePins />
    </section>
  );
};

export default Page;
