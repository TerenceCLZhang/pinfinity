import ProfilePins from "@/components/ProfilePins";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { username: string } }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { username } = await params;

  // Get user info from database
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="container flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center gap-4">
        <UserAvatar
          image={user.image as string}
          username={user.displayUsername as string}
          className="size-40"
          textSize="text-8xl"
        />
        <div className="text-center space-y-2">
          <h2 className="text-4xl">{user.name}</h2>
          <span className="text-sm italic">@{user.displayUsername}</span>
        </div>

        <p className="whitespace-pre-wrap text-center">{user.about}</p>

        <div className="space-x-5">
          <span>0 Pins</span>
          <span>0 Followers</span>
          <span>0 Following</span>
        </div>

        {session?.user.id === user.id ? (
          <Button type="button" asChild size={"lg"}>
            <Link href={"/profile/edit"}>Edit Profile</Link>
          </Button>
        ) : (
          <Button type="button" size={"lg"}>
            Follow
          </Button>
        )}
      </div>

      <ProfilePins />
    </div>
  );
};

export default Page;
