import ComponentHeading from "@/components/auth/ComponentHeading";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const Page = () => {
  return (
    <div className="auth-page-container">
      <ComponentHeading heading="Let's Find your Pinfinity Account" subheading="What's your email?"/>

      <ForgotPasswordForm />
    </div>
  );
};

export default Page;
