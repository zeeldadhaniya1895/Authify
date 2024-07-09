import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({message:"enter valid email"}),
    password: z.string().min(1,{message:"Password is required"}),
    code:z.optional(z.string()),
});

export const SettingSchema = z.object({
    name:z.optional(z.string()),
    isTwoFactorEnabled:z.optional(z.boolean()),
    role:z.enum([UserRole.ADMIN,UserRole.USER]),
    email:z.optional(z.string().email({message:"enter valid email"})),
    password:z.optional(z.string().min(6)),
    newPassword:z.optional(z.string().min(6)),
})
.refine((data)=>{
    if(data.newPassword && !data.password)
    {
        return false;
    }
    return true;
},{
    message:"Password is required!",
    path:["newPassword"]
}).refine((data)=>{
    if(!data.newPassword && data.password)
    {
        return false;
    }
    return true;
},{
    message:"New password is required!",
    path:["password"]
})
;

export const NewPasswordSchema = z.object({
    password: z.string().min(6,{message:"Password is required"}),
});
export const ResetSchema = z.object({
    email: z.string().email({message:"enter valid email"}),
});

export const RegisterSchema = z.object({
    email: z.string().email({message:"enter valid email"}),
    password: z.string().min(6,{message:"Minimum 6 character required"}),
    name: z.string().min(1,{message:"name is required"}),
});


