import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <section className="flex items-center justify-center flex-col gap-12">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-2xl">Oops! This page doesn't exist.</p>
      <Button asChild size={"lg"}>
        <Link href="/">Go back home</Link>
      </Button>
    </section>
  );
};

export default NotFound;
