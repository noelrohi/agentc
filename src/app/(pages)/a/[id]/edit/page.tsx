import UpsertAgentForm from "@/components/forms/upsert-agent";
import { getItemBySlug } from "@/data";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;
  const item = await getItemBySlug(id);
  if (!item) {
    return notFound();
  }
  return <UpsertAgentForm item={item} id={item.id} />;
}
