import { getAllCategories } from "@/lib/api";
import CategoryLinksClient from "./CategoryLinksClient";

export default async function NavLinks() {
  let categories = [];

  try {
    categories = await getAllCategories();
  } catch (error) {
    console.error(
      "Failed to fetch categories for NavLinks:",
      error.name
    );
  }

  return <CategoryLinksClient categories={categories} />;
}
