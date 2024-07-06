import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
    <div className="space-y-6 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-semibold text-white drop-shadow-md ">
        🔐Auth
      </h1>
      <p>A simple authentication component.</p>
    
    <LoginButton>
    <Button variant="secondary" size="lg" className="self-center">
        login
    </Button>
    </LoginButton>
    </div>
  </main>
  
  );
}
