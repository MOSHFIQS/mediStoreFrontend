import { getAllUsersAction } from "@/actions/admin.action";
import AllUsersClient from "@/components/allUsers/AllUsers";
import GlobalPagination from "@/components/shared/pagination/GlobalPagination";


export default async function AllUsersPage({ searchParams }: { searchParams: Promise<{ page?: number; limit?: number }> }) {
     const { page, limit } = await searchParams;
     const res = await getAllUsersAction(page, limit);

     if (!res.ok) {
          return <p className="p-6 text-center text-red-600">{res.message}</p>;
     }

     return (
          <div className="space-y-6 h-full flex flex-col justify-between py-2">
               <AllUsersClient initialUsers={res?.data?.data || []} />;
               <GlobalPagination
                    page={res.data?.meta?.page}
                    totalPages={res?.data?.meta?.totalPages}
                    limit={res.data?.meta?.limit}
               />
          </div>
     )

}
