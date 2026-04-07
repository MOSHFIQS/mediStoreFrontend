import { getSellerPaymentsAction } from "@/actions/payment.action";
import SellerPaymentsClient from "@/components/seller/payments/SellerPaymentsClient";

export default async function SellerPaymentsPage() {
  const res = await getSellerPaymentsAction();
  return <SellerPaymentsClient payments={res.ok ? res.data : []} />;
}