"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  signInWithEmailAndPassword,
  getAuth,
  UserInfo,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "@/firebase";

const handleSignIn = async (
  email: string,
  password: string,
): Promise<UserInfo> => {
  try {
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    if (error.code === "auth/invalid-credential") {
      throw new Error(
        "Credenciais inválidas. Por favor, verifique seu email e senha.",
      );
    }
    throw new Error(
      "Erro ao conectar ao servidor. Tente novamente mais tarde.",
    );
  }
};

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const user = await handleSignIn(email, password);
      if (user) {
        const maxAge = 60 * 60 * 24 * 7; // 7 days
        const secure = location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `token=${encodeURIComponent(user.uid)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
        router.push("/dashboard-main");
      } else {
        setError("Ocorreu um erro inesperado ao fazer login.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro na conexão");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (!result.user) {
        return;
      }

      const maxAge = 60 * 60 * 24 * 7; // 7 days
      const secure = location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `token=${encodeURIComponent(result.user.uid)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
      router.push("/dashboard-main/home");
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      setError("Erro ao fazer login com Google.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Por favor, insira o seu email para redefinir a senha.");
      return;
    }
    try {
      const auth = getAuth(app);
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Se o email estiver registado, receberá um link para redefinir a sua palavra-passe.",
      );
    } catch (error) {
      // For security, we don't reveal if the user was not found.
      setMessage(
        "Se o email estiver registado, receberá um link para redefinir a sua palavra-passe.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-card p-8 rounded-b-lg"
    >
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
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-2"
        >
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Ou continue com
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full py-3 rounded-lg flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </Button>
    </form>
  );
}
