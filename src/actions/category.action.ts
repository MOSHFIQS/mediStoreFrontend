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