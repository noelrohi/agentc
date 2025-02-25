import { ItemListPage } from "@/components/item-list-page";
import { getItems } from "@/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "tools directory",
};

export default async function Page() {
  const tools = await getItems("tool");
  return <ItemListPage items={tools} />;
}
