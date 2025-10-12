import EditProfileForm from "@/components/edit-profile/EditProfileForm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AvatarUpdateForm from "@/components/edit-profile/AvatarUpdateForm";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/");

  return (
    <section className="container max-w-3xl flex flex-col gap-15 mx-auto">
      <div className="edit-profile-section">
        <h2 className="edit-profile-heading">Avatar</h2>
        <Separator className="separator" />
        <AvatarUpdateForm />
      </div>

      <div className="edit-profile-section">
        <h2 className="edit-profile-heading">Account Settings</h2>
        <Separator className="separator" />
        <EditProfileForm />
      </div>
    </section>
  );
};

export default Page;
