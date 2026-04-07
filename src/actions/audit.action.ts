import { auditServiceServer } from "@/service/audit.server.service";

export async function getAuditLogsAction() {
     try {
          const res = await auditServiceServer.getAll();
          if (!res?.ok) throw new Error(res?.message || "Failed to fetch audit logs");
          return { ok: true, data: res.data, message: res?.message || "Audit logs fetched successfully" };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong", data: [] };
     }
}