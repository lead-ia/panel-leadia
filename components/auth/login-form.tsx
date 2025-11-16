"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


import { signInWithEmailAndPassword, getAuth, UserInfo, sendPasswordResetEmail } from 'firebase/auth';
import { app } from "@/firebase"

const handleSignIn = async (email : string , password : string): Promise<UserInfo> => {

  try {
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error : any) {
    if (error.code === 'auth/invalid-credential') {
      throw new Error("Credenciais inválidas. Por favor, verifique seu email e senha.");
    }
    throw new Error("Erro ao conectar ao servidor. Tente novamente mais tarde.");
  }
};


export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const user = await handleSignIn(email, password);
      if (user) {
        const maxAge = 60 * 60 * 24 * 7; // 7 days
        const secure = location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `token=${encodeURIComponent(user.uid)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
        router.push("/dashboard")
      } else {
        setError("Ocorreu um erro inesperado ao fazer login.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro na conexão");
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    setError("")
    setMessage("")
    if (!email) {
      setError("Por favor, insira o seu email para redefinir a senha.");
      return;
    }
    try {
      const auth = getAuth(app);
      await sendPasswordResetEmail(auth, email);
      setMessage("Se o email estiver registado, receberá um link para redefinir a sua palavra-passe.");
    } catch (error) {
      // For security, we don't reveal if the user was not found.
      setMessage("Se o email estiver registado, receberá um link para redefinir a sua palavra-passe.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-b-lg">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md">
          {error}
        </div>
      )}
      {message && (
        <div className="p-3 bg-primary/10 border border-primary text-primary text-sm rounded-md">
          {message}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Palavra-passe
          </label>
          <button
            type="button"
            onClick={handlePasswordReset}
            className="text-sm text-primary hover:underline"
          >
            Esqueceu a Palavra-passe?
          </button>
        </div>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg"
      >
        {loading ? "Carregando..." : "Entrar"}
      </Button>

    </form>
  )
}
