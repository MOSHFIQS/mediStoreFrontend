import { getMyPaymentsAction } from "@/actions/payment.action";
import MyPaymentsClient from "@/components/customer/payments/MyPaymentsClient";

export default async function MyPaymentsPage() {
     const res = await getMyPaymentsAction();
     return <MyPaymentsClient payments={res.ok ? res.data : []} />;
}