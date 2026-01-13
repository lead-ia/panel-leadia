import { useState } from 'react';
import { Search } from 'lucide-react';

interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  dataCadastro: string;
}

interface PacientesPageProps {
  pacientes: Paciente[];
}

export default function PacientesPage({ pacientes }: PacientesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPacientes = pacientes.filter(paciente => {
    const search = searchTerm.toLowerCase();
    return (
      paciente.nome.toLowerCase().includes(search) ||
      paciente.cpf.includes(searchTerm) ||
      paciente.telefone.includes(searchTerm)
    );
  });

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-white">
        <h1 className="text-[#1e3a5f] text-2xl">Pacientes</h1>
        <p className="text-gray-600 mt-1">Gerencie seus pacientes confirmados</p>
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
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#1e3a5f] to-[#6eb5d8] text-white">
              <tr>
                <th className="px-6 py-4 text-left">Nome</th>
                <th className="px-6 py-4 text-left">CPF</th>
                <th className="px-6 py-4 text-left">Telefone</th>
                <th className="px-6 py-4 text-left">Data de Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPacientes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhum paciente encontrado com os filtros aplicados
                  </td>
                </tr>
              ) : (
                filteredPacientes.map((paciente, index) => (
                  <tr 
                    key={paciente.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-800">{paciente.nome}</td>
                    <td className="px-6 py-4 text-gray-600">{paciente.cpf}</td>
                    <td className="px-6 py-4 text-gray-600">{paciente.telefone}</td>
                    <td className="px-6 py-4 text-gray-600">{paciente.dataCadastro}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Exibindo <span className="text-[#1e3a5f]">{filteredPacientes.length}</span> de{' '}
            <span className="text-[#1e3a5f]">{pacientes.length}</span> pacientes
          </p>
        </div>
      </div>
    </div>
  );
}
