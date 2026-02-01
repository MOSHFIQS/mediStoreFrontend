import { apiFetchServer } from "@/lib/api"

export const categoryService = {
     getAll: () => apiFetchServer("/categories"),

     create: (name: string) =>
          apiFetchServer("/categories", {
               method: "POST",
               body: JSON.stringify({ name }),
          }),
}
