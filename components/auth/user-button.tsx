"use client"
import{
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
}from "@/components/ui/dropdown-menu"

import { FaUser } from "react-icons/fa"



import{
    Avatar,
    AvatarImage,
    AvatarFallback
}from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/use-current-user"
import LogOutButton from "./logout-button";

export default function UserButton() {
    const user=useCurrentUser();
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
           <Avatar>
                <AvatarImage src={user?.image||""}/>
                <AvatarFallback>
                    {/* write anything it will display if image will not load */}
                    <FaUser/>
                </AvatarFallback>
           </Avatar> 
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <LogOutButton>
                <DropdownMenuItem>
                    LogOut
                </DropdownMenuItem>
            </LogOutButton>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
