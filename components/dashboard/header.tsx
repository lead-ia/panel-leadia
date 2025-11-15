"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LogOut } from "lucide-react"
import { getAuth, signOut } from "firebase/auth"
import { app } from "@/firebase"

export function DashboardHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;"
    await signOut(getAuth(app))
    router.push("/login")
  }

  return (
    <header className="border-b border-border bg-primary">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-32 h-16 bg-primary rounded-lg flex items-center justify-center">
            <Image src="/logo.png" alt="LeadIA Logo" width={100} height={100} />
          </div>
          
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-background hover:text-foreground transition-colors">
 <LogOut className="h-4 w-4" />
 Sair
        </button>
      </div>
    </header>
  )
}
