import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const auditServiceServer = {
     getAll: (query?: string) => apiFetchServerMain(`/audit?${query || ""}`),
};