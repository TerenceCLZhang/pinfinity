import ComponentHeading from "@/components/auth/ComponentHeading";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const Page = () => {
  return (
    <div className="auth-page-container">
      <ComponentHeading
        heading="Reset Password"
        subheading="Enter your New Password"
      />

      <ResetPasswordForm />
    </div>
  );
};

export default Page;
