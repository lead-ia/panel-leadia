import { MessageSquare, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useWhatsappSession } from "@/hooks/use-whatsapp-session";

export function WhatsappConnect() {
  const sessionName = "zeca_test";
  const session = useWhatsappSession(sessionName);
  const status = session?.payload?.status || "UNKNOWN";

  const getStatusColor = () => {
    switch (status) {
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
    switch (status) {
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
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-gray-800 font-medium">WhatsApp Oficial</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {getStatusText()}
              {session?.me?.pushName && ` - ${session.me.pushName}`}
            </p>
          </div>
        </div>
        <button
          className={`px-4 py-2 rounded-lg text-white transition-all flex items-center gap-2 ${
            status === "WORKING"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={() => {
            // Implement connect/disconnect logic here if needed,
            // or just open a modal to show QR code
            console.log("Toggle connection for session:", sessionName);
          }}
        >
          {status === "WORKING" ? "Desconectar" : "Conectar"}
        </button>
      </div>

      {status === "SCAN_QR_CODE" && (
        <div className="mt-3 p-3 bg-white rounded border border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Abra o WhatsApp no seu celular e escaneie o código.
          </p>
          {/* QR Code image would go here, fetched from another API endpoint */}
          <div className="w-32 h-32 bg-gray-200 mx-auto flex items-center justify-center text-xs text-gray-500">
            QR Code Placeholder
          </div>
        </div>
      )}
    </div>
  );
}
