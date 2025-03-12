import { ItemListPage } from "@/components/item-list-page";
import { getItems } from "@/data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "agents directory",
};

export default async function Page() {
  const agents = await getItems("agent");
  return (
    <Suspense>
      <ItemListPage items={agents} />
    </Suspense>
  );
}
