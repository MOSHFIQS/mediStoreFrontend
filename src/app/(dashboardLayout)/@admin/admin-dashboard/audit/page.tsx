import { getAuditLogsAction } from "@/actions/audit.action";
import AuditLogs from "@/components/admin/audit/AuditLogs";
import GlobalPagination from "@/components/shared/pagination/GlobalPagination";

export default async function AuditLogsPage({ searchParams }: { searchParams: Promise<{ page?: number; limit?: number }> }) {
  const { page, limit } = await searchParams
  const res = await getAuditLogsAction(page, limit);
  if (!res.ok) return <p className="p-4">Failed to load audit logs</p>;
  return (
    <div className="space-y-6 h-full flex flex-col justify-between py-2">
      <AuditLogs logs={res.data.data} />
      <GlobalPagination
        page={res.data?.meta?.page}
        limit={res.data?.meta?.limit}
        totalPages={res.data?.meta?.totalPages}
      />
    </div>
  );
}