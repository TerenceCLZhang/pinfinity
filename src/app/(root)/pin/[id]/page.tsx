import ImageButtons from "@/components/ImageButtons";
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

  // Get pin
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

  // Get pin author
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
          {pin.description && <p>{pin.description}</p>}
        </div>
      </div>

      <PinGrid />
    </section>
  );
};

export default Page;
