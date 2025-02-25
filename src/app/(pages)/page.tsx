import { ItemListPage } from "@/components/item-list-page";
import { getItems } from "@/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agents Directory",
};

export default async function Page() {
  const agents = await getItems("agent");
  return <ItemListPage items={agents} />;
}
