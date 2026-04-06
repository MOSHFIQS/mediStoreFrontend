import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const prescriptionServiceServer = {
     getMy: () => apiFetchServerMain("/prescription/my"),
     getAll: () => apiFetchServerMain("/prescription"),

     upload: (payload: { images: string[]; notes?: string }) =>
          apiFetchServerMain("/prescription", {
               method: "POST",
               body: JSON.stringify(payload),
          }),

     review: (id: string, payload: { status: "APPROVED" | "REJECTED"; items?: any[] }) =>
          apiFetchServerMain(`/prescription/${id}/review`, {
               method: "PATCH",
               body: JSON.stringify(payload),
          }),
};