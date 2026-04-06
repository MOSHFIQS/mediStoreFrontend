import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const categoryServiceServer = {
     getAll: () => apiFetchServerMain("/category"),

     create: (name: string) =>
               apiFetchServerMain("/category", {
                    method: "POST",
                    body: JSON.stringify({ name }),
               }),
}