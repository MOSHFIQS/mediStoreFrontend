import { getSellerMedicinesAction } from "@/actions/medicine.action"
import SellersMedicines from "@/components/sellerMedicines/SellersMedicines"
import GlobalPagination from "@/components/shared/pagination/GlobalPagination"

export default async function MedicinesListPage({ searchParams }: { searchParams: Promise<{ page?: number; limit?: number }> }) {
     const { page, limit } = await searchParams
     const res = await getSellerMedicinesAction(page, limit)


     if (!res.ok) {
          return <p className="p-4 text-red-500">Failed to load medicines</p>
     }

     return (
          <div className="space-y-6 h-full flex flex-col justify-between ">
              
               <SellersMedicines medicines={res.data?.data || []} />

               <GlobalPagination
                    page={res.data?.meta?.page}
                    totalPages={res?.data?.meta?.totalPages}
                    limit={res.data?.meta?.limit}
               />
          </div>
     )
     
     
}
