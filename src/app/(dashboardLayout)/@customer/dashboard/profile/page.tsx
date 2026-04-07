
import { getMeAction } from "@/actions/user.action";
import UserProfile from "@/components/userProfile/UserProfile";

export default async function ProfilePage() {
     const res = await getMeAction();
     console.log(res);

     if (!res.ok) {
          return <p className="p-6 ">Failed to load profile</p>;
     }

     return <UserProfile initialUser={res?.data?.user} />;
}
