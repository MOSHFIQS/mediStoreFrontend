import { getCategoryByIdAction } from "@/actions/category.action"
import UpdateCategory from "@/components/admin/category/UpdateCategory"


export default async function UpdateCategoryPage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params
     const catRes = await getCategoryByIdAction(id)

     const category = catRes.ok ? catRes?.data?.data : null
     console.log(category);

     if (!category) return <p className="p-6">Category not found</p>

     return <UpdateCategory category={category} />
}