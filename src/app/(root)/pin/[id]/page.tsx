import ImageButtons from "@/components/pin/ImageButtons";
import OtherPostsGrid from "@/components/pin/OtherPostsGrid";
import PinGrid from "@/components/PinGrid";
import UserAvatar from "@/components/UserAvatar";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pin = await db.pin.findUnique({
    where: { id },
  });

  if (!pin) notFound();

  return {
    title: `Pinfinity | ${pin.title}`,
    description: pin.description || "Check out this pin on our platform",
  };
}

// Page component
const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Fetch pin and author from database
  const pin = await db.pin.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!pin || !pin.author) notFound();

  const author = pin.author;

  return (
    <section className="space-y-20">
      <div className="container flex gap-10">
        <div className="card-border-shadow w-[45%] flex flex-col gap-5 items-center justify-center self-center">
          <Image
            src={pin.image}
            alt={pin.title}
            width={400}
            height={400}
            className="pin-img"
          />
          <ImageButtons pin={pin} />
        </div>

        <div className="flex-1 card-border-shadow flex flex-col gap-5 h-fit self-center max-h-full">
          <h2 className="text-4xl font-bold">{pin.title}</h2>

          <Link
            href={`/profile/${author?.username}`}
            className="flex items-center gap-3 hover:opacity-85"
          >
            <UserAvatar
              image={author.image}
              username={author.displayUsername as string}
            />
            <span className="font-semibold">{author.displayUsername}</span>
          </Link>

          {pin.description && (
            <p className="whitespace-pre-line">{pin.description}</p>
          )}

          <span>
            <b>Created:</b>{" "}
            {new Date(pin.createdAt).toLocaleDateString("en-GB")}
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold">
          Explore more pins by {author.displayUsername}
        </h2>

        <OtherPostsGrid pinId={pin.id} authorId={author.id} />
      </div>
    </section>
  );
};

export default Page;
