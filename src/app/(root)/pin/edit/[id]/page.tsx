import DeletePinBtn from "@/components/edit-pin/DeletePinBtn";
import EditPinForm from "@/components/edit-pin/EditPinForm";
import { Pin } from "@/generated/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  let pin: Pin;

  // Check if user is logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect(`/pin/${id}`);

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

  // Check if the logged in user is the author of the pin
  if (session.user.id !== pin.authorId) {
    redirect(`/pin/${id}`);
  }

  return (
    <section className="container w-full space-y-5">
      <h1 className="text-4xl text-center">Edit Pin</h1>
      <div className="flex gap-10 relative">
        <div className="card-border-shadow w-[45%] flex items-center justify-center">
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
          />
        </div>

        <div className="absolute top-0 right-0">
          <DeletePinBtn id={pin.id} url={pin.image} />
        </div>
      </div>
    </section>
  );
};

export default Page;
