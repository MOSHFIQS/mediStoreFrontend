import { apiFetchServerMain } from "@/lib/apiFetchServer";



export const medicineServiceServer = {


     getById: (id: string) =>
          apiFetchServerMain(`/medicines/${id}`),
}
