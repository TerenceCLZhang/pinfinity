import ComponentHeading from "@/components/auth/ComponentHeading";
import GoogleSocialAuth from "@/components/auth/GoogleSocialAuth";
import LogInForm from "@/components/auth/LogInForm";
import Link from "next/link";

const Page = () => {
  return (
    <div className="auth-page-container">
      <ComponentHeading
        heading="Welcome to Pinfinity"
        subheading="Find new Ideas"
      />

      <LogInForm />

      <div className="flex flex-col items-center gap-2">
        <span className="font-semibold">OR</span>

        <GoogleSocialAuth text="Log In" />
      </div>

      <p className="text-center mt-5">
        Not on Pinfinity?{" "}
        <Link href={"/signup"} className="font-bold">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Page;
