import AvatarUpdateForm from "@/components/AvatarUpdateForm";
import DeleteAccountBtn from "@/components/DeleteAccountBtn";
import EditProfileForm from "@/components/EditProfileForm";
import UpdateProfileResetPasswordBtn from "@/components/UpdateProfileResetPasswordBtn";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/");

  // Get user info from database
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/");

  return (
    <div className="container max-w-3xl flex flex-col gap-15">
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl text-primary">Avatar</h2>
        <Separator className="h-0.5 bg-secondary" />
        <AvatarUpdateForm />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl text-primary">Account Settings</h2>
        <Separator className="h-0.5 bg-secondary" />
        <EditProfileForm />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl text-primary">Danger Zone</h2>
        <Separator className="h-0.5 bg-secondary" />
        <div className="flex gap-3">
          <UpdateProfileResetPasswordBtn />
          <DeleteAccountBtn />
        </div>
      </div>
    </div>
  );
};

export default Page;
