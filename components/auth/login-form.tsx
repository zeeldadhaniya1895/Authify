"use client"

import { CardWraper } from "./card-wraper";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas";
import { useState, useTransition } from "react";
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
import { FormSuccess } from "@/components/form-success"
import { login } from "@/actions/login";
import Link from "next/link";

export function LoginForm() {

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ?
    "Email already in use with different provider!" : "";
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values,callbackUrl).then((data) => {

        if (data?.error) {
          form.reset();
          setError(data?.error);
        }
        if (data?.success) {
          form.reset();
          setSuccess(data?.success);
        }

        if (data?.twoFactor) {
          setShowTwoFactor(true);
        }

      }).catch(() => setError("Something went wrong"))

    });
  }

  const [isPending, startTransition] = useTransition();

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
            {!showTwoFactor && (<>
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
                      <Button size="xm" variant="link" asChild className="px-0 font-normal text-blue-400 text-end">
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>
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

            </>)}

            {
              showTwoFactor && (<>

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Two factor code</FormLabel>
                      <FormControl>
                        <Input {...field}
                          disabled={isPending}
                          placeholder="Enter your code"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                  )}
                />

              </>)
            }
            <FormError message={error || urlError} />
            <FormSuccess message={success} />

            <Button type="submit" className="w-full " disabled={isPending}>{showTwoFactor?"Verify Code":"Login" }</Button>



          </div>
        </form>
      </Form>
    </CardWraper>
  )
}
