import { apiFetch } from "@/lib/api"

export const categoryService = {
     getAll: () => apiFetch("/categories"),

     create: (name: string) =>
          apiFetch("/categories", {
               method: "POST",
               body: JSON.stringify({ name }),
          }),
}
