import { useState, useEffect } from "react";
import {
  Search,
  MoreVertical,
  UserMinus,
  CheckCircle,
  XCircle,
  FileText,
  X,
} from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import { formatDate, formatCPF, formatPhoneNumber } from "@/lib/utils";
import {
  Payment,
  PaymentsRepository,
} from "@/lib/repositories/payments-repository";
import { FilesRepository } from "@/lib/repositories/files-repository";
import { Loader2 } from "lucide-react";

export default function PatientsPage() {
  const { patients, loading, error, updatePatient } = usePatients();
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [comprovanteModal, setComprovanteModal] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const repo = new PaymentsRepository();
        const data = await repo.getPayments();
        setPayments(data);
      } catch (err) {
        console.error("Error fetching payments", err);
      } finally {
        setLoadingPayments(false);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (!comprovanteModal) {
        setSignedUrl(null);
        return;
      }

      setLoadingUrl(true);
      try {
        const filesRepo = new FilesRepository();
        const url = await filesRepo.getPresignedUrl(comprovanteModal);
        setSignedUrl(url);
      } catch (err) {
        console.error("Error fetching signed URL", err);
        setSignedUrl(null);
      } finally {
        setLoadingUrl(false);
      }
    };

    fetchSignedUrl();
  }, [comprovanteModal]);

  const patientsWithPayments = patients.map((paciente) => {
    const patientPayments = payments.filter(
      (pay) => pay.patientId === paciente.id,
    );
    const successPayment = patientPayments.find(
      (pay) => pay.status === "SUCCESS",
    );

    return {
      ...paciente,
      pago: !!successPayment || paciente.pago,
      comprovante: successPayment?.image || paciente.comprovante,
    };
  });

  const filteredPacientes = patientsWithPayments.filter((paciente) => {
    const search = searchTerm.toLowerCase();
    return (
      (paciente.name && paciente.name.toLowerCase().includes(search)) ||
      (paciente.document &&
        formatCPF(paciente.document).includes(searchTerm)) ||
      (paciente.phoneNumber &&
        formatPhoneNumber(paciente.phoneNumber).includes(searchTerm))
    );
  });

  const handleVoltarParaLead = async (pacienteId: string) => {
    try {
      if (confirm("Tem certeza que deseja voltar este paciente para Lead?")) {
        await updatePatient(pacienteId, { isPatient: false });
        setOpenMenuId(null);
      }
    } catch (e) {
      alert("Erro ao atualizar status");
    }
  };

  const handleMarcarPagamento = async (
    pacienteId: string,
    statusPago: boolean,
  ) => {
    try {
      // Assuming 'pago' is a field we want to track. The backend might not have it yet,
      // but the UI expects it. We'll store it in the extra data.
      // If the backend doesn't support it, it might be lost.
      // However, generic update route supports adding new fields.
      await updatePatient(pacienteId, { pago: statusPago });
      setOpenMenuId(null);
    } catch (e) {
      alert("Erro ao atualizar pagamento");
    }
  };

  if (loading || loadingPayments)
    return <div className="p-6 text-center">Carregando pacientes...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Erro: {error}</div>;

  return (
    <div className="bg-white rounded-3xl shadow-2xl h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-white">
        <h1 className="text-[#1e3a5f] text-2xl">Pacientes</h1>
        <p className="text-gray-600 mt-1">
          Gerencie seus pacientes confirmados
        </p>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 p-6 bg-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-[#1e3a5f]" />
          <h2 className="text-[#1e3a5f]">Pesquisar Pacientes</h2>
        </div>
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6eb5d8] text-gray-800"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#1e3a5f] to-[#6eb5d8] text-white">
              <tr>
                <th className="px-6 py-4 text-left rounded-tl-lg">Nome</th>
                <th className="px-6 py-4 text-left">CPF</th>
                <th className="px-6 py-4 text-left">Telefone</th>
                <th className="px-6 py-4 text-left">Data de Cadastro</th>
                <th className="px-6 py-4 text-center">Status Pagamento</th>
                <th className="px-6 py-4 text-center">Comprovante</th>
                <th className="px-6 py-4 text-center rounded-tr-lg">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPacientes.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhum paciente encontrado com os filtros aplicados
                  </td>
                </tr>
              ) : (
                filteredPacientes.map((paciente, index) => (
                  <tr
                    key={paciente.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-800">
                      {paciente.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {paciente.document ? formatCPF(paciente.document) : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {paciente.phoneNumber
                        ? formatPhoneNumber(paciente.phoneNumber)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {paciente.createdAt
                        ? formatDate(paciente.createdAt)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {paciente.pago ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          ✓ Pago
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          ✗ Não Pago
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {paciente.comprovante ? (
                        <button
                          onClick={() =>
                            setComprovanteModal(paciente.comprovante!)
                          }
                          className="inline-flex items-center justify-center p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                          title="Ver comprovante"
                        >
                          <FileText className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === paciente.id ? null : paciente.id,
                            )
                          }
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>

                        {openMenuId === paciente.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            ></div>
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                              <button
                                onClick={() =>
                                  handleMarcarPagamento(
                                    paciente.id,
                                    !paciente.pago,
                                  )
                                }
                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-200 ${
                                  paciente.pago
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {paciente.pago ? (
                                  <XCircle className="w-5 h-5" />
                                ) : (
                                  <CheckCircle className="w-5 h-5" />
                                )}
                                <div>
                                  <div className="font-medium">
                                    {paciente.pago
                                      ? "Marcar como Não Pago"
                                      : "Marcar como Pago"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Atualizar status de pagamento
                                  </div>
                                </div>
                              </button>
                              <button
                                onClick={() =>
                                  handleVoltarParaLead(paciente.id)
                                }
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-orange-600"
                              >
                                <UserMinus className="w-5 h-5" />
                                <div>
                                  <div className="font-medium">
                                    Voltar para Lead
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Remover status de paciente
                                  </div>
                                </div>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Exibindo{" "}
            <span className="text-[#1e3a5f]">{filteredPacientes.length}</span>{" "}
            de <span className="text-[#1e3a5f]">{patients.length}</span>{" "}
            pacientes
          </p>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">
                Pagos:{" "}
                <strong className="text-[#1e3a5f]">
                  {filteredPacientes.filter((p) => p.pago).length}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">
                Não pagos:{" "}
                <strong className="text-[#1e3a5f]">
                  {filteredPacientes.filter((p) => !p.pago).length}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comprovante Modal */}
      {comprovanteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#1e3a5f]">
                Comprovante de Pagamento
              </h2>
              <button
                onClick={() => setComprovanteModal(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200">
              {loadingUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-[#6eb5d8]" />
                  <p className="text-gray-500">
                    Gerando visualização segura...
                  </p>
                </div>
              ) : signedUrl ? (
                <img
                  src={signedUrl}
                  alt="Comprovante de Pagamento"
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              ) : (
                <div className="text-center p-6">
                  <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    Não foi possível carregar a imagem.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    O link pode ter expirado ou o arquivo não existe.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setComprovanteModal(null)}
                className="px-6 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#1e3a5f]/90 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
