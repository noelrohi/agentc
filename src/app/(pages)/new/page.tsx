import UpsertAgentForm from "@/components/forms/upsert-agent";
import { newFlag } from "@/flags";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Submit a New Agent or Tool",
  description:
    "Submit a new AI agent or tool to our directory using our AI-powered form",
};

export default async function NewPage() {
  const canCreateNew = await newFlag();
  if (!canCreateNew) {
    return notFound();
  }
  return (
    <div className="py-6">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Submit a New Agent or Tool
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Let AI do the heavy lifting! Just provide the website URL and a demo
            video URL (optional), and our AI will generate most of the
            information for you.
          </p>
        </div>
      </div>
      <UpsertAgentForm item={null} id={null} />
    </div>
  );
}
