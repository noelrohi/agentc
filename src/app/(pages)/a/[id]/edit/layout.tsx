import { editFlag } from "@/flags";
import { notFound } from "next/navigation";

export default async function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const canEdit = await editFlag();
  if (!canEdit) {
    return notFound();
  }
  return <div>{children}</div>;
}
