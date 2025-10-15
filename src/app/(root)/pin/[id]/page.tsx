import ImageButtons from "@/components/pin/ImageButtons";
import PinGrid from "@/components/PinGrid";
import UserAvatar from "@/components/UserAvatar";
import { Pin, User } from "@/generated/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  let pin: Pin;
  let author: User | null = null;

  // Fetch pin from database
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pins/${id}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      notFound();
    }

    pin = await res.json();
  } catch (error) {
    notFound();
  }

  // fetch pin author from database
  if (pin && pin.authorId) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${pin.authorId}`,
        { next: { revalidate: 300 } }
      );

      if (!res.ok) {
        console.error("Unable to load author");
      } else {
        author = await res.json();
      }
    } catch (error) {
      console.error("Unable to load author:", error);
    }
  }

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
            href={author ? `/profile/${author?.username}` : "/"}
            className="flex items-center gap-3 hover:opacity-85"
          >
            <UserAvatar
              image={author?.image ?? null}
              username={author?.displayUsername ?? "PinfinityUser"}
            />
            <span className="font-semibold">
              {author?.displayUsername ?? "PinfinityUser"}
            </span>
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

      <div className="space-y-5">
        <h2 className="text-2xl font-semibold">
          Explore more pins by {author?.displayUsername}
        </h2>
        <PinGrid endpoint={`user/${author?.id}/pins`} />
      </div>
    </section>
  );
};

export default Page;
