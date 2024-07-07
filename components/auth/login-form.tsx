"use client"

import { CardWraper } from "./card-wraper";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas";
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
import { FormSucess } from "../form-sucess";
import { login } from "@/actions/login";

export function LoginForm() {

  const searchParams=useSearchParams();
  const urlError=searchParams.get("error")==="OAuthAccountNotLinked" ?
  "Email already in use with different provider!":"";

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string|undefined>("");
  const [sucess, setSucess] = useState<string|undefined>("");


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit=(values:z.infer<typeof LoginSchema>)=>{
    setError("");
    setSucess("");
      startTransition(()=>{
        login(values).then((data)=>{
          
          
          setError(data?.error);

   
          setSucess(data?.sucess);
          
        });
        form.reset();
      });
  }

const [isPending,startTransition]=useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })
  return (
    <CardWraper
      headrLable="Welcome back"
      backButtonLabel="Don't have an account? sign-up"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
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
                    <FormLabel>password</FormLabel>
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

              <FormError message={error||urlError}/>
              <FormSucess message={sucess}/>
                      
            <Button type="submit" className="w-full " disabled={isPending}>Login</Button>



          </div>
        </form>
      </Form>
    </CardWraper>
  )
}
