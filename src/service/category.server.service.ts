import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const categoryServiceServer = {
     getAll: () => apiFetchServerMain("/category"),

     create: (data: { name: string; description?: string; image?: string }) =>
          apiFetchServerMain("/category", {
               method: "POST",
               body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    image: data.image,
               }),
          }),
}