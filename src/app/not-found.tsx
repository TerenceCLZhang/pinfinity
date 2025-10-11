import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center">
      <main className="max-w-xl flex flex-col items-center justify-center text-center gap-5 bg-secondary p-20 rounded-lg shadow-lg border">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="text-2xl">Oops! This page doesn't exist.</p>
        <Button asChild size={"lg"}>
          <Link href="/">Go back home</Link>
        </Button>
      </main>
    </div>
  );
};

export default NotFound;
