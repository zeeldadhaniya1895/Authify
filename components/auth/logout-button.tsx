"use client"

import {logout} from "@/actions/logout"
import { Children } from "react";

interface LogOutButtonPtops{
    children?:React.ReactNode;
}

export default function LogOutButton({children}:LogOutButtonPtops) {
    const onClick =()=>{
        logout();
    }
  return (
    <span className="cursor-pointer" onClick={onClick}>
        {children}
    </span>
  )
}
