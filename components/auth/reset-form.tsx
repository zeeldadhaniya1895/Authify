"use client"

import { CardWraper } from "./card-wraper";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { ResetSchema } from "@/schemas";
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
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSucess } from "../form-sucess";
import { reset } from "@/actions/reset";

export function ResetForm() {

  const [error, setError] = useState<string|undefined>("");
  const [sucess, setSucess] = useState<string|undefined>("");
  const [isPending,startTransition]=useTransition();
 
  const handleSubmit=(values:z.infer<typeof ResetSchema>)=>{
    setError("");
    setSucess("");
      startTransition(()=>{
        reset(values).then((data)=>{
          
          
          setError(data?.error);

   
          setSucess(data?.sucess);
          
        });
        form.reset();
      });
  }


  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    }
  })
  return (
    <CardWraper
      headrLable="Let's reset password!"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
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
              <FormError message={error}/>
              <FormSucess message={sucess}/>
                      
            <Button type="submit" className="w-full " disabled={isPending}>Send password reset email</Button>



          </div>
        </form>
      </Form>
    </CardWraper>
  )
}
