import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
     SidebarInset,
     SidebarProvider,
     SidebarTrigger,
} from "@/components/ui/sidebar"
import { Roles } from "@/constants/roles"
import { serverAuthService } from "@/service/auth.service"
import { ReactNode } from "react"

export default async function DashboardLayout({ admin, customer,seller }: { admin: ReactNode, customer: ReactNode,seller : ReactNode }) {
    const data =await serverAuthService.getDecodedToken()
    console.log(data);


     if (!data) {
          return <div>Please login</div>
     }


     const userInfo = {
          role : data.role
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
