"use client"

import { setting } from "@/actions/setting"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useTransition, useState } from "react"
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

export default function SettingsPage() {

  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const onSubmite = (values: z.infer<typeof SettingSchema>) => {
    startTransition(() => {
      setting(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            update();
            setSuccess(data.success);
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Enter you existing password" disabled={isPending}></Input>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )

                }
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                     New Password
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Enter new password" disabled={isPending}></Input>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )

                }
              />
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


