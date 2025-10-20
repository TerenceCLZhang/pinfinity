import EditPinForm from "@/components/edit-pin/EditPinForm";
import { getSession } from "@/lib/getSession";
import { db } from "@/lib/prisma";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Check if user is logged in
  const session = await getSession();

  if (!session) redirect(`/pin/${id}`);

  // Get pin
  const pin = await db.pin.findUnique({
    where: { id },
  });

  if (!pin) notFound();

  // Check if the logged in user is the author of the pin
  if (session.user.id !== pin.authorId) {
    redirect(`/pin/${id}`);
  }

  return (
    <section className="container w-full space-y-5">
      <h1 className="text-4xl text-center">Edit Pin</h1>
      <div className="flex gap-10 flex-col lg:flex-row">
        <div className="card-border-shadow flex items-center justify-center lg:w-[45%]">
          <Image
            src={pin.image}
            alt={pin.title}
            width={500}
            height={500}
            className="pin-img"
          />
        </div>
        <div className="flex-1 self-center">
          <EditPinForm
            id={pin.id}
            title={pin.title}
            description={pin.description ?? ""}
            url={pin.image}
          />
        </div>
      </div>
    </section>
  );
};

export default Page;
