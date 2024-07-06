

export default function AuthLayout({children,}:{children: React.ReactNode;}) {
  return (
    <div className="h-full flex bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 items-center justify-center">
      {children}
    </div>
  )
}
