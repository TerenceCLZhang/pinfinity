import ComponentHeading from "@/components/auth/ComponentHeading";
import CreateUsernameForm from "@/components/auth/CreateUsernameForm";

const Page = async () => {
  return (
    <div className="auth-page-container">
      <ComponentHeading
        heading="Welcome to Pinfinity"
        subheading="Create your username"
      />
      <CreateUsernameForm />
    </div>
  );
};

export default Page;
