"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function CalendarCallback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const processCallback = async () => {
            const code = searchParams.get("code");
            const state = searchParams.get("state");
            const error = searchParams.get("error");

            if (error) {
                setStatus("error");
                setMessage("Acesso negado pelo usuário");
                return;
            }

            if (!code) {
                setStatus("error");
                setMessage("Código de autorização não encontrado");
                return;
            }

            try {
                const params = new URLSearchParams({ code });
                if (state) {
                    params.append("state", state);
                }

                // Mantemos a chamada para nossa API interna que faz a troca do token
                const response = await fetch(`/api/calendar/oauth/callback?${params.toString()}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || data.detail || "Erro ao processar callback");
                }

                setStatus("success");
                setMessage(`Calendário conectado com sucesso! Email: ${data.oauth_data?.email || "N/A"}`);

                setTimeout(() => {
                    router.push("/dashboard-main/settings");
                }, 2000);
            } catch (err) {
                setStatus("error");
                setMessage(err instanceof Error ? err.message : "Erro desconhecido");
            }
        };

        processCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="flex flex-col items-center gap-4">
                    {status === "loading" && (
                        <>
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                            <h2 className="text-2xl text-gray-800">Processando...</h2>
                            <p className="text-gray-600 text-center">
                                Finalizando a conexão com o Google Calendar
                            </p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <CheckCircle className="w-16 h-16 text-green-500" />
                            <h2 className="text-2xl text-gray-800">Sucesso!</h2>
                            <p className="text-gray-600 text-center">{message}</p>
                            <p className="text-sm text-gray-500">Redirecionando...</p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <XCircle className="w-16 h-16 text-red-500" />
                            <h2 className="text-2xl text-gray-800">Erro</h2>
                            <p className="text-gray-600 text-center">{message}</p>
                            <button
                                onClick={() => router.push("/dashboard-main/settings")}
                                className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e3a5f] to-[#6eb5d8] text-white hover:shadow-lg transition-all"
                            >
                                Voltar para Configurações
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
