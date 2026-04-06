"use server";

import { categoryServiceServer } from "@/service/category.server.service";

export async function createCategoryAction(data: { name: string; description?: string; image?: string }) {
    const name = data.name?.trim();
    if (!name) throw new Error("Category name is required");

    try {
        const res = await categoryServiceServer.create({
            name,
            description: data.description?.trim(),
            image: data.image,
        });

        if (!res.ok) throw new Error(res.message || "Failed to create category");

        return { ok: true, message: "Category created successfully" };
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong");
    }
}

export async function getAllCategoriesAction() {
    try {
        const res = await categoryServiceServer.getAll();
        if (!res.ok) throw new Error(res.message || "Failed to fetch categories");

        return res.data;
    } catch (err: any) {
        throw new Error(err?.message || "Something went wrong while fetching categories");
    }
}

export async function updateCategoryAction(id: string, data: { name?: string; description?: string; image?: string }) {
    const res = await categoryServiceServer.update(id, data);
    if (!res.ok) throw new Error(res.message || "Failed to update category");
    return res.data;
}

export async function deleteCategoryAction(id: string) {
    const res = await categoryServiceServer.delete(id);
    if (!res.ok) throw new Error(res.message || "Failed to delete category");
    return true;
}