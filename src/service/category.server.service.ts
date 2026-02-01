import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const categoryServiceServer = {
     getAll: () => apiFetchServerMain("/categories"),

     create: (name: string) =>
               apiFetchServerMain("/categories", {
                    method: "POST",
                    body: JSON.stringify({ name }),
               }),
}