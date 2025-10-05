import ComponentHeading from "@/components/auth/ComponentHeading";
import GoogleSocialAuth from "@/components/auth/GoogleSocialAuth";
import SignUpForm from "@/components/auth/SignUpForm";
import Link from "next/link";

const Page = () => {
  return (
    <div className="auth-page-container">
      <ComponentHeading
        heading="Welcome to Pinfinity"
        subheading="Find new Ideas"
      />

      <SignUpForm />

      <div className="flex flex-col items-center gap-2">
        <span className="font-semibold">OR</span>

        <GoogleSocialAuth text="Sign Up" />
      </div>

      <p className="text-center mt-5">
        Already have an account?{" "}
        <Link href={"/login"} className="font-bold">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Page;
