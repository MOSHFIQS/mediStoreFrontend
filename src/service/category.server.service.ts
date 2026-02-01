import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const categoryServiceServer = {
     getAll: () => apiFetchServerMain("/categories"),
}