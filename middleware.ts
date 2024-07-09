import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { authRoutes,DEFAULT_LOGIN_REDIRECT,apiAuthPrefix,publicRoutes } from "./routes"
const { auth } = NextAuth(authConfig)


export default auth((req)=> {
  const{nextUrl}=req
  const isLoggedIn=!!req.auth;

  const isApiAuthRoute=nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute=publicRoutes.includes(nextUrl.pathname);
  const isauthRoutes=authRoutes.includes(nextUrl.pathname);
 
    if(isApiAuthRoute)
    {
     return ;
    }
    if(isauthRoutes)
    {
     if(isLoggedIn)
     {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
     }
     return ;
    }
    if(!isPublicRoute&&!isLoggedIn)
    {
      let callbackUrl=nextUrl.pathname;
      if(nextUrl.search)
      {
        callbackUrl+=nextUrl.search;
      }

      const encodeCallbackUrl=encodeURIComponent(callbackUrl);

      return Response.redirect(new URL(`/auth/login?callbackUrl=${encodeCallbackUrl}`, nextUrl));
    }
    return ;
})


export const config={
    matcher:['/((?!.+\\.[\\w]+$|_next).*)','/','/(api|trpc)(.*)'],
}

