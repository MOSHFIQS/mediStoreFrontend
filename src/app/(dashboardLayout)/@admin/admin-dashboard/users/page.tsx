import { getAllUsersAction } from "@/actions/admin.action";
import AllUsersClient from "@/components/allUsers/AllUsers";


export default async function AllUsersPage() {
     const res = await getAllUsersAction();

     if (!res.ok) {
          return <p className="p-6 text-center text-red-600">{res.message}</p>;
     }

     return <AllUsersClient initialUsers={res?.data} />;
}
