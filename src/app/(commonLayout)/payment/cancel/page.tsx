import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
     return (
          <div className="min-h-screen flex items-center justify-center px-4">
               <div className="text-center space-y-5 max-w-md">
                    <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto" />
                    <h1 className="text-3xl font-bold">Payment Cancelled</h1>
                    <p className="text-muted-foreground">You cancelled the payment. Your order is still saved.</p>
                    <div className="flex gap-3 justify-center">
                         <Button asChild><Link href="/dashboard/orders">View Orders</Link></Button>
                         <Button variant="outline" asChild><Link href="/cart">Back to Cart</Link></Button>
                    </div>
               </div>
          </div>
     );
}