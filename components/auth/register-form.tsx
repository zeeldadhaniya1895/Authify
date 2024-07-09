"use client"

import { CardWraper } from "./card-wraper";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schemas";
import { useState,useTransition } from "react";

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
import { register } from "@/actions/register";

export function RegisterForm() {

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string|undefined>("");
  const [success, setSuccess] = useState<string|undefined>("");


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit=(values:z.infer<typeof RegisterSchema>)=>{
    setError("");
    setSuccess("");
      startTransition(()=>{
        register(values).then((data)=>{
          setError(data.error);
          setSuccess(data.success);
        });
        form.reset();
      });
  }

const [isPending,startTransition]=useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name:"",
    }
  })
  return (
    <CardWraper
      headrLable="Create an account"
      backButtonLabel="Already have an account? sign-in"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">

          <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field}
                      disabled={isPending}
                      placeholder="Enter Username"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field}
                      disabled={isPending}
                      placeholder="Enter your email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

              )}
            />

            <div className="relative">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field}
                        disabled={isPending}
                        placeholder="Enter your password"
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
                      
            <Button type="submit" className="w-full " disabled={isPending}>Create an account</Button>



          </div>
        </form>
      </Form>
    </CardWraper>
  )
}
