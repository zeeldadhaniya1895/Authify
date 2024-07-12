"use client"

import { setting } from "@/actions/setting"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useTransition, useState, useEffect } from "react"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { SettingSchema } from "@/schemas"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/hooks/use-current-user"
import { FormSuccess } from "@/components/form-success"
import { FormError } from "@/components/form-error"

import { Select,SelectContent,SelectItem,SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole } from "@prisma/client"
import{Switch} from "@/components/ui/switch"
import { Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {

  const user = useCurrentUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  useEffect(()=>{update()},[])

  const [isPending, startTransition] = useTransition();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };
  const { update } = useSession();
  const onSubmite = (values: z.infer<typeof SettingSchema>) => {
    startTransition(() => {
      setError("");
      setSuccess("");
      setting(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            update();

            setSuccess(data.success);
            form.reset({
              ...values,
              password: undefined,
              newPassword: undefined,
            });
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };


  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      name: user?.name || "undefined",
      email:user?.email|| "undefined",
      password: undefined,
      newPassword: undefined,
      role:user?.role||undefined,
      isTwoFactorEnabled:user?.isTwoFactorEnabled||undefined,
    }
  });

 
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">⚙️ Setting</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmite)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your user name" disabled={isPending}></Input>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )

                }
              />
              {user?.isOAuth===false&&(<>
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
              <div className="relative">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input {...field}
                          disabled={isPending}
                          placeholder="Enter new password"
                          type={showPassword2 ? "text" : "password"}
                        />
                      </FormControl>
                      <span
                        className="absolute inset-y-11 right-3 flex items-center cursor-pointer w-5"
                        onClick={togglePasswordVisibility2}
                      >
                        <i className={showPassword2 ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                        {showPassword2 && <Eye />}
                        {!showPassword2 && <EyeOff />}

                      </span>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              </>)}
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role"/>
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage/>
                          <SelectContent>
                            <SelectItem value={UserRole.ADMIN}>
                               Admin
                            </SelectItem>
                            <SelectItem value={UserRole.USER}>
                               User
                            </SelectItem>
                          </SelectContent>
                      </Select>
                    <FormMessage/>
                  </FormItem>
                )

                }
              />
             {user?.isOAuth===false &&(
               <FormField
               control={form.control}
               name="isTwoFactorEnabled"
               render={({ field }) => (
                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                   <div className="space-y-0.5">
                       <FormLabel>Two Factor Authentication</FormLabel>
                       <FormDescription>
                         Enable two factor authentication for your account
                       </FormDescription>
                   </div>
                   <FormControl>
                     <Switch disabled={isPending} checked={field.value} onCheckedChange={field.onChange}/>
                   </FormControl>
                 </FormItem>
               )

               }
             />
             )}
            </div>
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button type="submit" disabled={isPending}> Save </Button>
          </form>
        </Form>
      </CardContent>

    </Card>
  )
}


