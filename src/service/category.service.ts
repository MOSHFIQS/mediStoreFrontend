import { apiFetchClient } from "@/lib/api"

export const categoryService = {
     getAll: () => apiFetchClient("/categories"),

     create: (name: string) =>
          apiFetchClient("/categories", {
               method: "POST",
               body: JSON.stringify({ name }),
          }),
}
