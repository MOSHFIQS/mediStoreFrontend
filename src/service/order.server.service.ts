import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const orderServiceServer = {
     create: (payload: any) =>
          apiFetchServerMain("/orders", {
               method: "POST",
               body: JSON.stringify(payload),
          }),
}