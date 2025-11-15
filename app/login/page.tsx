"use client"
import Link from "next/link"
import Image from "next/image"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 bg-gradient-to-r from-primary to-primary rounded-xl" >
          <div className="w-64 h-32 rounded-xl flex items-center justify-center" >
            <Image  src="/logo.png" alt="LeadIA Logo" width={240} height={240} />
          </div>
        </div>


        <LoginForm />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Não tem uma conta?{" "}
          <Link href="/signup" className="text-primary hover:underline font-semibold">
            Registre-se aqui
          </Link>
        </p>
      </div>
    </div>
  )
}
