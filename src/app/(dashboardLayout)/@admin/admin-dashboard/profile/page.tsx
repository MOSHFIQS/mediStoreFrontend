
import UserProfile from "@/components/userProfile/UserProfile";
import { userServiceServer } from "@/service/user.server.service";

export default async function AdminProfilePage() {
     const res = await userServiceServer.getMe();
     console.log(res);

     if (!res.ok) {
          return <p className="p-6 ">Failed to load profile</p>;
     }

     return <UserProfile initialUser={res?.data?.data?.user} />;
}
