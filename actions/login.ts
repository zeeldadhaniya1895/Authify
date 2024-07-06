"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login=async (values:z.infer<typeof LoginSchema>)=>{
    const validatesFields = LoginSchema.safeParse(values);
    if(!validatesFields.success)
    {
        return {error:"invalid fields!"};
    }
   
    const {email,password}=validatesFields.data;

    try{
        await signIn("credentials",{
            email,password,redirectTo:DEFAULT_LOGIN_REDIRECT,
        })//aa same rite google mate pan lakhi sakay pan google vadu client side karva mate alag thi karel 6
    }catch(error){
        if(error instanceof AuthError )
        {
            switch(error.type)
            {
               case "CredentialsSignin" : return {error:"Invalid credentials!"}
               default: return{error:"Something went wrong!"}
            }
        }
       throw error; // throw karvi jaruri nakar tamne default page upar redirect nai kare
    }
return{sucess:"login sucess"}
}