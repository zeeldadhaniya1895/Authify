import NextAuth from "next-auth"
import authConfig from "./auth.config"
import {PrismaAdapter} from "@auth/prisma-adapter"
import { db } from "./lib/db"

import { getUserById } from "./data/user"
 


export const { auth, handlers:{GET,POST}, signIn, signOut } = NextAuth({
    pages:{
      signIn:"/auth/login",
      error:"/auth/error",
    },
  events:{
      async linkAccount({user})
      {
        await db.user.update({where:{id:user.id},data:{emailVerified:new Date()}})
      }
  },
    callbacks:{
      async signIn({user,account})
      {
        if(account?.provider!=="credentials")  //this logic might need to be change if you use other providers then github and google
        {
          return true; 
        }
        const existingUser=await getUserById(user.id!);
        //prevent sign in without email verification
        if(!existingUser?.emailVerified) return false;
        return true;
      },
     
      async session({token,session})
      {   if(token.sub&&session.user)
          {
            session.user.id=token.sub;
          }
          if(token.role&&session.user)
            {
              session.user.role =token.role ;
            }
          return session;
      },
       async jwt({token})
       {
          if(!token.sub) return token;
          const existingUser = await getUserById(token.sub);
          if(!existingUser) return token;

          token.role=existingUser.role;

         return token;
       }   
    },
    adapter:PrismaAdapter(db),
    session:{strategy:"jwt"},
  ...authConfig,
})