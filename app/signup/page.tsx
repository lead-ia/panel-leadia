"use client"

import { SignupForm } from "@/components/auth/signup-form"
import Image from "next/image"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <div className="text-center mb-8">
          <Image src="/logo.png" alt="LeadIA Logo" width={100} height={28} />
          <p className="text-muted-foreground mt-2">Registre-se para começar</p>
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
