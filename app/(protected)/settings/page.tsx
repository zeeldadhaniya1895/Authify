import { auth, signOut } from "@/auth"
import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";
export default async function SettingsPage() {
    const session=await auth();
  return (
    <div>
      settings page!
      {JSON.stringify(session)}
      <form action={async()=>{
        "use server";

        await signOut({redirectTo:DEFAULT_LOGOUT_REDIRECT})
      }}>
        <button>Sign Out</button>
      </form>
    </div>
  )
}
