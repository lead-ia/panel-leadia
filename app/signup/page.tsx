"use client"

import { SignupForm } from "@/components/auth/signup-form"
import Image from "next/image"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 bg-gradient-to-r from-primary to-primary rounded-xl" >
            <div className="w-64 h-32 rounded-xl flex items-center justify-center" >
              <Image  src="/logo.png" alt="LeadIA Logo" width={240} height={240} />
            </div>
          </div>
  

        <SignupForm />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Iniciar sessão
          </Link>
        </p>
      </div>
    </div>
  )
}
