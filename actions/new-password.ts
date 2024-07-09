"use server";
import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";

export const newPassword=async(values:z.infer<typeof NewPasswordSchema>,token?:string|null,)=>{

    if(!token)
    {
        return {error:"missing token!"};
    }
    const validatedFields=NewPasswordSchema.safeParse(values);

    if(!validatedFields){
        return {error:"Invalid fields!"};
    }
    const { password } = validatedFields.data as { password: string }; 
    
    const existingToken=await getPasswordResetTokenByToken(token);

    if(!existingToken){
        return {error:"Invalid token!"}
    }
    const hasExpired=new Date(existingToken.expires)<new Date() 
    if(hasExpired)
    {
        return {error:"token has expired!"};
    }
    const existingUser=await getUserByEmail(existingToken.email);
    if(!existingUser)
    {
        return {error:"Email does not exist!"}
    }
    const email=existingToken.email;

    const hashedPassword=await bcrypt.hash(password,10);
    await db.user.update({
        where:{id:existingUser.id},
        data:{password:hashedPassword},
    })
    await db.passwordResetToken.delete({
        where:{id:existingToken.id}
    })
    
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
               default: {
                return{error:"Something went wrong!"}}
            }
        }
       throw error; // throw karvi jaruri nakar tamne default page upar redirect nai kare
    }
    return{success:"password is updated!"}
}
