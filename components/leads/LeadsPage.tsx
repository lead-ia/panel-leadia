import { useState } from "react";
import { Search } from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import { formatDate, formatCPF, formatPhoneNumber } from "@/lib/utils";

export default function LeadsPage() {
  const { leads, loading, error, updatePatient } = usePatients();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm.toLowerCase();
    return (
      (lead.name && lead.name.toLowerCase().includes(search)) ||
      (lead.document && formatCPF(lead.document).includes(searchTerm)) ||
      (lead.phoneNumber && formatPhoneNumber(lead.phoneNumber).includes(searchTerm))
    );
  });

  if (loading)
    return <div className="p-6 text-center">Carregando leads...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Erro: {error}</div>;

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-white">
        <h1 className="text-[#1e3a5f] text-2xl">Leads</h1>
        <p className="text-gray-600 mt-1">Gerencie seus potenciais pacientes</p>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 p-6 bg-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-[#1e3a5f]" />
          <h2 className="text-[#1e3a5f]">Pesquisar Leads</h2>
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
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#1e3a5f] to-[#6eb5d8] text-white">
              <tr>
                <th className="px-6 py-4 text-left">Nome</th>
                <th className="px-6 py-4 text-left">CPF</th>
                <th className="px-6 py-4 text-left">Telefone</th>
                <th className="px-6 py-4 text-left">Data de Cadastro</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhum lead encontrado com os filtros aplicados
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-800">{lead.name}</td>
                    <td className="px-6 py-4 text-gray-600">{formatCPF(lead.document)}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatPhoneNumber(lead.phoneNumber)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {lead.hasAppointment ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          ✓ Consulta Agendada
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          Sem consulta
                        </span>
                      )}
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
            <span className="text-[#1e3a5f]">{filteredLeads.length}</span> de{" "}
            <span className="text-[#1e3a5f]">{leads.length}</span> leads
          </p>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">
                Com consulta:{" "}
                <strong className="text-[#1e3a5f]">
                  {filteredLeads.filter((l) => l.hasAppointment).length}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-gray-600">
                Sem consulta:{" "}
                <strong className="text-[#1e3a5f]">
                  {filteredLeads.filter((l) => !l.hasAppointment).length}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
