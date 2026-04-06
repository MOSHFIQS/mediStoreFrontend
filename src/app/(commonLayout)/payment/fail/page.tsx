import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentFailPage() {
     return (
          <div className="min-h-screen flex items-center justify-center px-4">
               <div className="text-center space-y-5 max-w-md">
                    <XCircle className="w-20 h-20 text-red-500 mx-auto" />
                    <h1 className="text-3xl font-bold">Payment Failed</h1>
                    <p className="text-muted-foreground">
                         Something went wrong with your payment. Please try again.
                    </p>
                    <div className="flex gap-3 justify-center">
                         <Button asChild>
                              <Link href="/cart">Back to Cart</Link>
                         </Button>
                         <Button variant="outline" asChild>
                              <Link href="/my-orders">My Orders</Link>
                         </Button>
                    </div>
               </div>
          </div>
     );
}