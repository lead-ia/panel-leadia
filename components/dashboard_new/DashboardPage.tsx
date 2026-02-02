import { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, Users, 
  CheckCircle, Clock, Target, ArrowUpRight, ArrowDownRight,
  Zap, CreditCard, Award
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Area, AreaChart
} from 'recharts';

type PeriodType = 'daily' | 'weekly' | 'monthly';

export function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('monthly');

  // Dados simulados baseados nos preços de configuração
  const consultaPresencialPreco = 250; // R$ 250
  const consultaOnlinePreco = 150; // R$ 150

  // Dados diários (últimos 7 dias)
  const dailyData = {
    consultasPresenciais: 3,
    consultasOnline: 5,
    leadsConvertidos: 8,
    totalLeads: 12,
    receitaTotal: (3 * consultaPresencialPreco) + (5 * consultaOnlinePreco),
  };

  // Dados semanais (última semana)
  const weeklyData = {
    consultasPresenciais: 18,
    consultasOnline: 25,
    leadsConvertidos: 43,
    totalLeads: 67,
    receitaTotal: (18 * consultaPresencialPreco) + (25 * consultaOnlinePreco),
  };

  // Dados mensais
  const monthlyData = {
    consultasPresenciais: 78,
    consultasOnline: 102,
    leadsConvertidos: 180,
    totalLeads: 245,
    receitaTotal: (78 * consultaPresencialPreco) + (102 * consultaOnlinePreco),
  };

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return monthlyData;
    }
  };

  const data = getCurrentData();
  const taxaConversao = ((data.leadsConvertidos / data.totalLeads) * 100).toFixed(1);
  const ticketMedio = (data.receitaTotal / (data.consultasPresenciais + data.consultasOnline)).toFixed(2);

  // Dados para gráfico de linha (evolução diária no mês)
  const evolucionReceita = [
    { dia: '01', receita: 1200, consultas: 6 },
    { dia: '05', receita: 2800, consultas: 14 },
    { dia: '10', receita: 4500, consultas: 22 },
    { dia: '15', receita: 7200, consultas: 36 },
    { dia: '20', receita: 10500, consultas: 52 },
    { dia: '25', receita: 13800, consultas: 68 },
    { dia: '30', receita: data.receitaTotal, consultas: data.consultasPresenciais + data.consultasOnline },
  ];

  // Dados para gráfico de barras (comparativo por semana)
  const comparativoSemanal = [
    { semana: 'Sem 1', presencial: 15, online: 22, receita: 7050 },
    { semana: 'Sem 2', presencial: 19, online: 26, receita: 8650 },
    { semana: 'Sem 3', presencial: 22, online: 28, receita: 9700 },
    { semana: 'Sem 4', presencial: 22, online: 26, receita: 9400 },
  ];

  // Dados para gráfico de pizza (distribuição de consultas)
  const distribuicaoConsultas = [
    { name: 'Presencial', value: data.consultasPresenciais, color: '#1e3a5f' },
    { name: 'Online', value: data.consultasOnline, color: '#6eb5d8' },
  ];

  // Cálculo de crescimento (comparado ao período anterior)
  const crescimentoReceita = 23.5;
  const crescimentoConsultas = 18.2;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
      {/* Header do Dashboard */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#6eb5d8] p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-white mb-2">Dashboard Financeiro</h1>
            <p className="text-white/80">Acompanhe o crescimento da sua clínica em tempo real</p>
          </div>
          
          {/* Filtro de Período */}
          <div className="flex gap-2 bg-white/10 p-1 rounded-xl backdrop-blur-sm">
            {[
              { id: 'daily', label: 'Hoje' },
              { id: 'weekly', label: 'Semana' },
              { id: 'monthly', label: 'Mês' },
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id as PeriodType)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  selectedPeriod === period.id
                    ? 'bg-white text-[#1e3a5f] shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Cards de Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Receita Total */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <DollarSign className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  +{crescimentoReceita}%
                </div>
              </div>
              <h3 className="text-white/80 text-sm mb-1">Receita Total</h3>
              <p className="text-3xl font-semibold">R$ {data.receitaTotal.toLocaleString('pt-BR')}</p>
              <p className="text-white/70 text-xs mt-2">
                {selectedPeriod === 'daily' ? 'Hoje' : selectedPeriod === 'weekly' ? 'Esta semana' : 'Este mês'}
              </p>
            </div>

            {/* Total de Consultas */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  +{crescimentoConsultas}%
                </div>
              </div>
              <h3 className="text-white/80 text-sm mb-1">Total de Consultas</h3>
              <p className="text-3xl font-semibold">{data.consultasPresenciais + data.consultasOnline}</p>
              <p className="text-white/70 text-xs mt-2">
                {data.consultasPresenciais} presenciais · {data.consultasOnline} online
              </p>
            </div>

            {/* Taxa de Conversão */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Target className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-green-400/30 px-3 py-1 rounded-full">
                  <Award className="w-4 h-4" />
                  Excelente
                </div>
              </div>
              <h3 className="text-white/80 text-sm mb-1">Taxa de Conversão</h3>
              <p className="text-3xl font-semibold">{taxaConversao}%</p>
              <p className="text-white/70 text-xs mt-2">
                {data.leadsConvertidos} de {data.totalLeads} leads
              </p>
            </div>

            {/* Ticket Médio */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <CreditCard className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                  <Zap className="w-4 h-4" />
                  Ótimo
                </div>
              </div>
              <h3 className="text-white/80 text-sm mb-1">Ticket Médio</h3>
              <p className="text-3xl font-semibold">R$ {ticketMedio}</p>
              <p className="text-white/70 text-xs mt-2">
                Por consulta realizada
              </p>
            </div>
          </div>

          {/* Card de Destaque - Impacto do LeadIA */}
          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#6eb5d8] rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">LeadIA está gerando resultados!</h2>
                    <p className="text-white/80">Veja o impacto direto no seu faturamento</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Economia de Tempo</p>
                    <p className="text-2xl font-semibold">40 horas/mês</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">Leads Atendidos 24/7</p>
                    <p className="text-2xl font-semibold">{data.totalLeads} leads</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">ROI Estimado</p>
                    <p className="text-2xl font-semibold">850%</p>
                  </div>
                </div>
              </div>
              
              <div className="ml-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30">
                  <p className="text-white/80 text-sm mb-2">Receita Gerada pelo LeadIA</p>
                  <p className="text-4xl font-bold">R$ {data.receitaTotal.toLocaleString('pt-BR')}</p>
                  <div className="flex items-center gap-2 mt-3 text-green-300">
                    <ArrowUpRight className="w-5 h-5" />
                    <span className="text-sm">+R$ {(data.receitaTotal * 0.235).toFixed(0)} vs mês anterior</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Evolução de Receita */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-[#1e3a5f] text-lg mb-4">Evolução de Receita</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={evolucionReceita}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6eb5d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6eb5d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="dia" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ddd', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="#6eb5d8" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorReceita)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Comparativo Semanal */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-[#1e3a5f] text-lg mb-4">Comparativo de Consultas por Semana</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparativoSemanal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="semana" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ddd', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Legend />
                  <Bar dataKey="presencial" fill="#1e3a5f" radius={[8, 8, 0, 0]} name="Presencial" />
                  <Bar dataKey="online" fill="#6eb5d8" radius={[8, 8, 0, 0]} name="Online" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Distribuição de Consultas */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-[#1e3a5f] text-lg mb-4">Distribuição de Consultas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribuicaoConsultas}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distribuicaoConsultas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#1e3a5f] rounded"></div>
                  <span className="text-sm text-gray-600">Presencial: {data.consultasPresenciais}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#6eb5d8] rounded"></div>
                  <span className="text-sm text-gray-600">Online: {data.consultasOnline}</span>
                </div>
              </div>
            </div>

            {/* Card de Projeções */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl mb-6">Projeções de Crescimento</h3>
              
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">Próximo Mês</span>
                    <div className="flex items-center gap-1 text-green-300">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm">+23%</span>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold">
                    R$ {(data.receitaTotal * 1.23).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">Próximo Trimestre</span>
                    <div className="flex items-center gap-1 text-green-300">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm">+45%</span>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold">
                    R$ {(data.receitaTotal * 3 * 1.45).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">Meta Anual</span>
                    <div className="flex items-center gap-1 text-yellow-300">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">Em progresso</span>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold">
                    R$ {(data.receitaTotal * 12 * 1.3).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards de Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-[#1e3a5f] font-semibold">Melhor Desempenho</h4>
              </div>
              <p className="text-gray-600 text-sm mb-2">Consultas Online cresceram</p>
              <p className="text-2xl font-bold text-green-600">+32%</p>
              <p className="text-xs text-gray-500 mt-2">Comparado ao período anterior</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-[#1e3a5f] font-semibold">Novos Pacientes</h4>
              </div>
              <p className="text-gray-600 text-sm mb-2">Captados este período</p>
              <p className="text-2xl font-bold text-blue-600">{data.leadsConvertidos}</p>
              <p className="text-xs text-gray-500 mt-2">Taxa de conversão: {taxaConversao}%</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-[#1e3a5f] font-semibold">Tempo Economizado</h4>
              </div>
              <p className="text-gray-600 text-sm mb-2">Com automação LeadIA</p>
              <p className="text-2xl font-bold text-purple-600">40h</p>
              <p className="text-xs text-gray-500 mt-2">Equivalente a R$ 2.000 em salário</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
