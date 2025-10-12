import CreatePinForm from "@/components/create-pin/CreatePinForm";
import React from "react";

const Page = () => {
  return (
    <section className="container w-full space-y-5">
      <h1 className="text-4xl text-center">Create a Pin</h1>
      <CreatePinForm />
    </section>
  );
};

export default Page;
