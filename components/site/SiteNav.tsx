import Navbar from "./Navbar";
import { getNavTree } from "@/lib/queries/navbar";

// Server wrapper: navbar ağacını çeker ve client Navbar'a verir.
export default async function SiteNav() {
  const items = await getNavTree();
  return <Navbar items={items} />;
}
