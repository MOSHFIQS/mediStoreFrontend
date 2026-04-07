import { getAllPaymentsAction } from "@/actions/payment.action";
import AdminPaymentsClient from "@/components/admin/payments/AdminPaymentsClient";

export default async function AdminPaymentsPage() {
     const res = await getAllPaymentsAction();
     return <AdminPaymentsClient payments={res.ok ? res.data : []} />;
}