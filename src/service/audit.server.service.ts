import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const auditServiceServer = {
     getAll: () => apiFetchServerMain("/audit"),
};