import { getAuditLogsAction } from "@/actions/audit.action";
import AuditLogs from "@/components/admin/audit/AuditLogs";

export default async function AuditLogsPage() {
  const res = await getAuditLogsAction();
  if (!res.ok) return <p className="p-4">Failed to load audit logs</p>;
  return <AuditLogs logs={res.data.data} />;
}