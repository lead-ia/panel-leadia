import {
  MessageCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  Smartphone,
  Loader2,
} from "lucide-react";
import { useWhatsappSession } from "@/hooks/use-whatsapp-session";
import { useUser } from "@/components/auth/user-context";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function WhatsappConnect() {
  const { dbUser, updateUser } = useUser();
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  // Use the hook with the user's phone number if available
  const sessionName = dbUser?.phoneNumber
    ? dbUser.phoneNumber.replace(/\D/g, "")
    : "";
  const {
    sessionStatus,
    isLoading,
    error,
    startSession,
    getQrCode,
    stopSession,
  } = useWhatsappSession(sessionName);

  const handleCreateSession = async () => {
    if (!phoneNumberInput) return;

    try {
      const cleanPhone = "55" + phoneNumberInput.replace(/\D/g, "");

      // Persist phone number first
      await updateUser({ phoneNumber: cleanPhone });

      // The hook will automatically pick up the new phone number from dbUser
      // and start checking the session.
      // We might need to explicitly start it if it doesn't exist.
      // But since we just updated the user, the component will re-render with the new sessionName.
      // We can trigger startSession in an effect or just rely on the user clicking connect if it fails.
      // Given the flow, let's just save the number. The hook's checkSession might find nothing,
      // then the user can click "Conectar" (which we should probably expose if status is disconnected).

      // Actually, if we just set the phone number, the hook re-runs checkSession.
      // If checkSession returns null, we might want to auto-start.
      // For now, let's just save and let the user click "Conectar" if needed,
      // or we can call startSession if we had access to the new sessionName immediately.
    } catch (error) {
      console.error("Error creating user/session:", error);
    }
  };

  const handleStartSession = async () => {
    if (sessionName) {
      await startSession();
    }
  };

  const handleScanQrCode = async () => {
    const url = await getQrCode();
    if (url) {
      setQrCodeUrl(url);
      setIsQrDialogOpen(true);
    }
  };

  const getStatusColor = () => {
    switch (sessionStatus) {
      case "WORKING":
        return "bg-green-500";
      case "STARTING":
      case "SCAN_QR_CODE":
        return "bg-yellow-500";
      case "STOPPED":
      case "FAILED":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = () => {
    switch (sessionStatus) {
      case "WORKING":
        return "Conectado";
      case "STARTING":
        return "Iniciando...";
      case "SCAN_QR_CODE":
        return "Escaneie o QR Code";
      case "STOPPED":
        return "Parado";
      case "FAILED":
        return "Falha na conexão";
      default:
        return "Desconectado";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${getStatusColor()} flex items-center justify-center text-white transition-colors duration-300`}
          >
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-gray-800 font-medium">WhatsApp Oficial</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {getStatusText()}
              {sessionStatus === "WORKING" && (
                <CheckCircle className="w-3 h-3 text-green-500" />
              )}
            </p>
          </div>
        </div>

        {!dbUser?.phoneNumber ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" className="gap-2">
                <Smartphone className="w-4 h-4" />
                Conectar
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Conectar WhatsApp</SheetTitle>
                <SheetDescription>
                  Insira seu número de telefone para iniciar a conexão com o
                  WhatsApp.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Telefone
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">
                      +55
                    </span>
                    <Input
                      id="phone"
                      value={phoneNumberInput}
                      onChange={(e) => setPhoneNumberInput(e.target.value)}
                      placeholder="11999999999"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" onClick={handleCreateSession}>
                    Salvar e Conectar
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex gap-2">
            {sessionStatus === "SCAN_QR_CODE" ? (
              <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleScanQrCode}
                    disabled={isLoading}
                    variant="default"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Carregando QR...
                      </>
                    ) : (
                      "Escanear QR Code"
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Escaneie o QR Code</DialogTitle>
                    <DialogDescription>
                      Abra o WhatsApp no seu celular, vá em Aparelhos Conectados
                      e escaneie o código abaixo.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-center p-6">
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-64 h-64 object-contain"
                      />
                    ) : (
                      <div className="w-64 h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                        {isLoading
                          ? "Carregando..."
                          : "Erro ao carregar QR Code"}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <button
                className={`px-4 py-2 rounded-lg text-white transition-all flex items-center gap-2 ${
                  sessionStatus === "WORKING"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={() => {
                  if (sessionStatus !== "WORKING") {
                    handleStartSession();
                  } else {
                    stopSession();
                  }
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : sessionStatus === "WORKING" ? (
                  "Desconectar"
                ) : (
                  "Conectar"
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {sessionStatus === "SCAN_QR_CODE" && !isQrDialogOpen && (
        <div className="mt-3 p-3 bg-white rounded border border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Sessão aguardando leitura do QR Code. Clique no botão acima para
            visualizar.
          </p>
        </div>
      )}

      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
}
