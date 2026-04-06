import AllUsersClient from "@/components/allUsers/AllUsers";
import { adminServiceServer } from "@/service/admin.server.service";


export default async function AllUsersPage() {
     const res = await adminServiceServer.getUsers();

     if (!res.ok) {
          return <p className="p-6 text-center text-red-600">{res.message}</p>;
     }

     return <AllUsersClient initialUsers={res?.data?.data} />;
}
