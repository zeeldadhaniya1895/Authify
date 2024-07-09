import NextAuth from "next-auth"
import authConfig from "./auth.config"
import {PrismaAdapter} from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { getUserById } from "./data/user"
import getAccountByUserId from "./data/account"

 


export const { auth, handlers:{GET,POST}, signIn, signOut,unstable_update } = NextAuth({
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

        if(existingUser.isTwoFactorEnabled)
          {
            const twoFactorConfirmation=await getTwoFactorConfirmationByUserId(existingUser.id);
            if(!twoFactorConfirmation) return false;

            await db.twoFactorConfirmation.delete({
              where:{id:twoFactorConfirmation.id}
            })
          } 
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
            if(session.user)
              {
                session.user.name=token.name;
                session.user.isTwoFactorEnabled =token.isTwoFactorEnabled as boolean;
                
                session.user.email=token.email as string;
                session.user.isOAuth=token.isOAuth as boolean;
              }
              
              

          return session;
      },
       async jwt({token})
       {
          if(!token.sub) return token;
          const existingUser = await getUserById(token.sub);
          if(!existingUser) return token;

          const existingAccount=await getAccountByUserId(existingUser.id);

          token.isOAuth=!!existingAccount;
          token.role=existingUser.role;
          token.email=existingUser.email;
          token.name=existingUser.name;
          token.isTwoFactorEnabled=existingUser.isTwoFactorEnabled;

         return token;
       }   
    },
    adapter:PrismaAdapter(db),
    session:{strategy:"jwt"},
  ...authConfig,
})