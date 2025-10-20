import ProfileClient from "@/components/profile/ProfileClient";
import ProfilePins from "@/components/profile/ProfilePins";
import UserAvatar from "@/components/UserAvatar";
import { getSession } from "@/lib/getSession";
import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Metadata
export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;

  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) notFound();

  return {
    title: `Pinfinity | ${user.displayUsername}`,
    description:
      user.about || `Check out ${user.displayUsername}'s pins on Pinfinity`,
  };
}

// Page Component
const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const session = await getSession();

  const { username } = await params;

  const user = await db.user.findUnique({ where: { username } });

  if (!user) notFound();

  return (
    <section className="container flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center gap-4">
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

        <ProfileClient
          userId={session?.user.id}
          profileId={user.id}
          about={user.about}
        />
      </div>

      <ProfilePins id={user.id} username={user.username as string} />
    </section>
  );
};

export default Page;
