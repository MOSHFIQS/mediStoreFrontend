import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage({
     searchParams,
}: {
     searchParams: { orderId?: string };
}) {
     return (
          <div className="min-h-screen flex items-center justify-center px-4">
               <div className="text-center space-y-5 max-w-md">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                    <h1 className="text-3xl font-bold">Payment Successful!</h1>
                    <p className="text-muted-foreground">
                         Your order has been confirmed and is being processed.
                    </p>
                    {searchParams.orderId && (
                         <p className="text-sm text-gray-500">
                              Order ID: <span className="font-mono font-semibold">{searchParams.orderId}</span>
                         </p>
                    )}
                    <div className="flex gap-3 justify-center">
                         <Button asChild>
                              <Link href="/dashboard/orders">View Orders</Link>
                         </Button>
                         <Button variant="outline" asChild>
                              <Link href="/medicines">Continue Shopping</Link>
                         </Button>
                    </div>
               </div>
          </div>
     );
}