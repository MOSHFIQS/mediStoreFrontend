"use server";

import { categoryServiceServer } from "@/service/category.server.service";

export async function createCategoryAction(name: string) {
     if (!name || !name.trim()) {
          return { ok: false, message: "Category name is required" };
     }

     try {
          const res = await categoryServiceServer.create(name.trim());
          if (!res.ok) {
               return { ok: false, message: res.message || "Failed to create category" };
          }
          return { ok: true, message: "Category created successfully" };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong" };
     }
}
