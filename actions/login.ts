"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {generateVerificationToken} from "@/lib/tokens"
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const login=async (values:z.infer<typeof LoginSchema>)=>{
    const validatesFields = LoginSchema.safeParse(values);
    if(!validatesFields.success)
    {
        return {error:"invalid fields!"};
    }
   
    const {email,password}=validatesFields.data;
    const existingUser= await getUserByEmail(email);

    if(!existingUser||!existingUser.email || !existingUser.password)
    {
        return {error:"User does not exist!"}
    }
    if(!existingUser.emailVerified)
    {  const passwordsMatch=await bcrypt.compare(password,existingUser.password);
        if(passwordsMatch)
        {
            const verificationToken=await generateVerificationToken(existingUser.email)
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        )
        
         
        return {sucess: "Confirmation email sent!"}
        }
        else
        {
            return {error:"Wrong password!"}
        }
    }

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