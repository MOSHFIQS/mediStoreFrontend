
import AllCategories from "@/components/allCategories/allCategories";
import { categoryServiceServer } from "@/service/category.server.service";

export default async function CategoriesPage() {
    const res = await categoryServiceServer.getAll();

    if (!res.ok) {
        return <p className="p-6 text-red-600">Failed to load categories</p>;
    }

    return <AllCategories initialCategories={res.data.data} />;
}
