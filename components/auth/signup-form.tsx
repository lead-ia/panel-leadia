"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

import { createUserWithEmailAndPassword, getAuth, updateProfile, User } from 'firebase/auth';
import { app } from "@/firebase"

const handleSignUp = async (email: string, password: string, fullName: string): Promise<User> => {
  const auth = getAuth(app);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: fullName });
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error("Este email já está em uso.");
    }
    throw new Error("Erro ao registrar. Tente novamente mais tarde.");
  }
};

export function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("As palavras-passe não coincidem")
      setLoading(false)
      return
    }

    try {
      const user = await handleSignUp(formData.email, formData.password, formData.fullName);

      if (user) {
        const maxAge = 60 * 60 * 24 * 7 // 7 days
        const secure = location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `token=${encodeURIComponent(user.uid)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
        router.push("/dashboard")
      } else {
        setError("Ocorreu um erro inesperado ao registrar.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na conexão");
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg shadow-sm border border-border">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
          Nome Completo
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="(Nome do médico a ser exibido)"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="o.seu@email.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
          Palavra-passe
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Crie uma palavra-passe forte"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
          Confirmar palavra-passe
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirme a sua palavra-passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

    

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg"
      >
        {loading ? "Carregando..." : "Registrar"}
      </Button>
    </form>
  )
}
