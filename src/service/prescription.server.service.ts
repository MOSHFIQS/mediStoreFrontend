import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const prescriptionServiceServer = {
     getMy: () => apiFetchServerMain("/prescriptions/my"),
     getAll: () => apiFetchServerMain("/prescriptions"),

     upload: (payload: { images: string[]; notes?: string }) =>
          apiFetchServerMain("/prescriptions", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     review: (id: string, payload: { status: "APPROVED" | "REJECTED"; items?: any[] }) =>
          apiFetchServerMain(`/prescriptions/${id}/review`, {
               method: "PATCH",
               body: JSON.stringify(payload),
          }),
};