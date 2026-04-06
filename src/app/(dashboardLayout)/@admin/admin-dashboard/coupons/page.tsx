import AdminCouponsClient from "@/components/admin/AdminCouponsClient";
import { couponServiceServer } from "@/service/coupon.server.service";

export default async function AdminCouponsPage() {
     const res = await couponServiceServer.getAll();
     return <AdminCouponsClient coupons={res.ok ? res.data.data : []} />;
}