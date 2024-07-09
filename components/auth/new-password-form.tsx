"use client"

import { CardWraper } from "./card-wraper";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { NewPasswordSchema} from "@/schemas";
import { useState,useTransition } from "react";
import { useSearchParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { newPassword } from "@/actions/new-password";
import Link from "next/link";

export function NewPasswordForm() {

const searchParams=useSearchParams();
const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string|undefined>("");
  const [success, setSuccess] = useState<string|undefined>("");


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit=(values:z.infer<typeof NewPasswordSchema>)=>{
    setError("");
    setSuccess("");
      startTransition(()=>{
        newPassword(values,token).then((data)=>{
          
          
          setError(data?.error);

   
          setSuccess(data?.success);
          
        });
        form.reset();
      });
  }

const [isPending,startTransition]=useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {

      password: "",
    }
  })
  return (
    <CardWraper
      headrLable="Set new password"
      backButtonLabel="Back to sign-in page!"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">

            <div className="relative">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input {...field}
                        disabled={isPending}
                        placeholder="Enter new password"
                        type={showPassword ? "text" : "password"}
                      />
                    </FormControl>

                    <span
                      className="absolute inset-y-11 right-3 flex items-center cursor-pointer w-5"
                      onClick={togglePasswordVisibility}
                    >
                      <i className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                      {showPassword && <Eye />}
                      {!showPassword && <EyeOff />}

                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

              <FormError message={error}/>
              <FormSuccess message={success}/>
                      
            <Button type="submit" className="w-full " disabled={isPending}>Reset password</Button>



          </div>
        </form>
      </Form>
    </CardWraper>
  )
}
