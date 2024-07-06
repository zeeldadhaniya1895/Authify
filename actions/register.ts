"use server";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register=async (values:z.infer<typeof RegisterSchema>)=>{
    const validatesFields = RegisterSchema.safeParse(values);
    if(!validatesFields.success)
    {
        return {error:"Something went wrong!"};
    }
    const {email,password,name} = validatesFields.data;
    const hashedPassword = await bcrypt.hash(password,10);

    const existingUser = await getUserByEmail(email);
    if (existingUser){
        return {error: "Email already in use!"}
    }
    await db.user.create({
        data:{
            name,
            email,
            password:hashedPassword,
        }
    })

    //* TODO : Send verification token email

    return {sucess:"Account created"};
}