"use server"
import { auditServiceServer } from "@/service/audit.server.service";
import { buildQueryString } from "@/utils/buildQueryString";

export async function getAuditLogsAction(page?: number, limit?: number) {
     try {
          const query = buildQueryString({
               page,
               limit
          });
          const res = await auditServiceServer.getAll(query);
          if (!res?.ok) throw new Error(res?.message || "Failed to fetch audit logs");
          return { ok: true, data: res.data, message: res?.message || "Audit logs fetched successfully" };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong", data: [] };
     }
}