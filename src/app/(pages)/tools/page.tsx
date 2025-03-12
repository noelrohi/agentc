import { ItemListPage } from "@/components/item-list-page";
import { getItems } from "@/data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "tools directory",
};

export default async function Page() {
  const tools = await getItems("tool");
  return (
    <Suspense>
      <ItemListPage items={tools} />
    </Suspense>
  );
}
