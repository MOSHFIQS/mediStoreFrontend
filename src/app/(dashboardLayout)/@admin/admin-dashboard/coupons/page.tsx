import { getAllCouponsAction } from "@/actions/coupon.action";
import AllCoupons from "@/components/admin/coupons/AllCoupons";

export default async function CouponsPage() {
  const res = await getAllCouponsAction();
  return <AllCoupons coupons={res.data} />;
}