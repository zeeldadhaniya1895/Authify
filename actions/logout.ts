"use server"

import { signOut } from "@/auth"
import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";

export const logout=async()=>{
    //some server stuff
    await signOut({redirectTo:DEFAULT_LOGOUT_REDIRECT});
}