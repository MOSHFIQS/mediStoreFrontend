import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuGroup,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@/types/user.types"
import Link from "next/link"

export function ProfileDropdown({ user, handleLogout }: { user: User, handleLogout: () => void }) {
     return (
          <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    <div className="rounded-full border border-gray-300 w-[35px] h-[35px] overflow-hidden">
                         <img
                              src={user.image || "https://i.ibb.co.com/LhN7fmfM/5578a3db8b5f1101c971bdf120e63784.jpg"}
                              alt="User avatar"
                              className="rounded-full object-cover w-full h-full"
                              onError={(e) => {
                                   e.currentTarget.src =
                                        "https://i.ibb.co.com/LhN7fmfM/5578a3db8b5f1101c971bdf120e63784.jpg"
                              }}
                         />
                         
                    </div>

               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-60 mr-1" align="start">
                    <DropdownMenuGroup>
                         <DropdownMenuLabel className="border border-gray-300">
                              <div>
                                   <div className="text-xs font-normal">My Account</div>
                                   <div> Hi, {user.name}</div>
                                   <div className="text-black">{user.email}</div>
                              </div>
                         </DropdownMenuLabel>

                         <DropdownMenuItem  className="bg-gray-50">
                                   <Link href={'/dashboard'}>Dashboard</Link>
                         </DropdownMenuItem>
                    </DropdownMenuGroup>

               </DropdownMenuContent>
          </DropdownMenu>
     )
}