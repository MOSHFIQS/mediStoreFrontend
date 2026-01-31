
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
     SidebarInset,
     SidebarProvider,
     SidebarTrigger,
} from "@/components/ui/sidebar"
import { Roles } from "@/constants/roles"
import { sessionService } from "@/service/token.service"
import { ReactNode } from "react"

export default async  function DashboardLayout({ admin, customer, seller }: { admin: ReactNode, customer: ReactNode, seller: ReactNode }) {

     const data = await sessionService.getUserFromToken()
     console.log(data);
   
     // const {user} = useAuth()
     // const router = useRouter()

     // useEffect(() => {
     //      if (!user) {
     //           toast.error("Login first to access this page");
     //           router.push("/login");
     //      }
     // }, [user, router]);





     const userInfo = {
          role: data?.role as string
     }

     let content

     switch (userInfo.role) {
          case Roles.admin:
               content = admin
               break
          case Roles.seller:
               content = seller
               break
          default:
               content = customer
     }


     return (
          <SidebarProvider>
               <AppSidebar user={userInfo} />
               <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                         <div className="flex items-center gap-2 px-3">
                              <SidebarTrigger />
                              <Separator orientation="vertical" className="mr-2 h-4" />

                         </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                         {content}
                    </div>
               </SidebarInset>
          </SidebarProvider>
     )
}
