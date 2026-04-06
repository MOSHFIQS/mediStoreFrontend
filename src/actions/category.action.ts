"use server";

import { categoryServiceServer } from "@/service/category.server.service";
import { revalidatePath } from "next/cache";

// Create a category
export async function createCategoryAction(data: { name: string; description?: string; image?: string }) {
    const name = data?.name?.trim();

    if (!name) {
        return { ok: false, message: "Category name is required" };
    }

    try {
        const res = await categoryServiceServer.create({
            name,
            description: data?.description?.trim(),
            image: data?.image,
        });

        if (!res?.ok) {
            return { ok: false, message: res?.message || "Failed to create category" };
        }

        revalidatePath("/admin-dashboard/category");

        return {
            ok: true,
            message: res?.message || "Category created successfully",
            data: res?.data,
        };
    } catch (err: any) {
        return { ok: false, message: err?.message || "Something went wrong" };
    }
}

// Get all categories
export async function getAllCategoriesAction() {
    try {
        const res = await categoryServiceServer.getAll();

        if (!res?.ok) {
            return {
                ok: false,
                message: res?.message || "Failed to fetch categories",
                data: [],
            };
        }

        return {
            ok: true,
            message: res?.message || "Categories fetched successfully",
            data: res?.data || [],
        };
    } catch (err: any) {
        return {
            ok: false,
            message: err?.message || "Something went wrong while fetching categories",
            data: [],
        };
    }
}

// Get category by ID
export async function getCategoryByIdAction(id: string) {
    try {
        const res = await categoryServiceServer.getById(id);

        if (!res?.ok) {
            return { ok: false, message: res?.message || "Failed to fetch category" };
        }

        return {
            ok: true,
            message: res?.message || "Category fetched successfully",
            data: res?.data,
        };
    } catch (err: any) {
        return {
            ok: false,
            message: err?.message || "Something went wrong while fetching category",
        };
    }
}

// Update category
export async function updateCategoryAction(
    id: string,
    data: { name?: string; description?: string; image?: string }
) {
    try {
        const res = await categoryServiceServer.update(id, data);

        if (!res?.ok) {
            return { ok: false, message: res?.message || "Failed to update category" };
        }

        revalidatePath("/admin-dashboard/category");

        return {
            ok: true,
            message: res?.message || "Category updated successfully",
            data: res?.data,
        };
    } catch (err: any) {
        return {
            ok: false,
            message: err?.message || "Something went wrong while updating category",
        };
    }
}

// Delete category
export async function deleteCategoryAction(id: string) {
    try {
        const res = await categoryServiceServer.delete(id);

        if (!res?.ok) {
            return { ok: false, message: res?.message || "Failed to delete category" };
        }

        revalidatePath("/admin-dashboard/category");

        return {
            ok: true,
            message: res?.message || "Category deleted successfully",
        };
    } catch (err: any) {
        return {
            ok: false,
            message: err?.message || "Something went wrong while deleting category",
        };
    }
}