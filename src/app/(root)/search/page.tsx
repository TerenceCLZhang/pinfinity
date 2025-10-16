import PinGrid from "@/components/PinGrid";
import { redirect } from "next/navigation";

// Metadata
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const { q } = await searchParams;

  return {
    title: `Pinfinity | ${q}`,
    description: `Search results for "${q}" on Pinfinity`,
  };
}

// Page Component
const Page = async ({ searchParams }: { searchParams: { q: string } }) => {
  const { q } = await searchParams;

  // Redirect back to home page if no query
  if (!q) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-4">
      <h2>
        Search Results for <i>{q}</i>
      </h2>
      <PinGrid endpoint={`pins/search/${q}`} search={q} />
    </div>
  );
};

export default Page;
