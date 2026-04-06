
import { getAllCategoriesAction } from "@/actions/category.action";
import AllCategories from "@/components/allCategories/allCategories";

export default async function CategoriesPage() {
     const res = await getAllCategoriesAction();

     if (!res.ok) {
          return <p className="p-6 text-red-600">Failed to load categories</p>;
     }

     return <AllCategories initialCategories={res?.data?.data} />;
}
