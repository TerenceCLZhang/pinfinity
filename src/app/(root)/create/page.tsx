import CreatePinForm from "@/components/create-pin/CreatePinForm";
import React from "react";

const Page = () => {
  return (
    <main className="container w-full space-y-15">
      <h1 className="text-4xl text-center">Create a Pin</h1>
      <CreatePinForm />
    </main>
  );
};

export default Page;
