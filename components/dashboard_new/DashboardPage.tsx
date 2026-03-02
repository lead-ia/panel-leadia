import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  CreditCard,
  Award,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  DashboardRepository,
  DashboardData,
} from "@/lib/repositories/dashboard-repository";

type PeriodType = "daily" | "weekly" | "monthly";

export function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("monthly");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const repo = new DashboardRepository();
        // Uses the default tenantId or updates as needed.
        const data = await repo.getDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 text-center">
        <div className="max-w-md bg-white p-10 rounded-2xl shadow-xl border border-blue-100">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1e3a5f] mb-4">
            Ainda não há informações
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Seu dashboard está sendo preparado. Assim que houver dados de
            consultas e atendimentos, você poderá acompanhar todos os seus
            resultados aqui em tempo real.
          </p>
        </div>
      </div>
    );
  }

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case "daily":
        return dashboardData.daily;
      case "weekly":
        return dashboardData.weekly;
      case "monthly":
        return dashboardData.monthly;
      default:
        return dashboardData.monthly;
    }
  };

  const data = getCurrentData();
  const taxaConversao = ((data.convertedLeads / data.totalLeads) * 100).toFixed(
    1,
  );
  const ticketMedio = (
    data.totalRevenue /
    (data.inPersonConsultations + data.onlineConsultations)
  ).toFixed(2);

  // Growth variables mapped from the backend
  const crescimentoReceita = dashboardData.revenueGrowth;
  const crescimentoConsultas = dashboardData.consultationGrowth;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
      {/* Header do Dashboard */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#6eb5d8] p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-white mb-2">Dashboard Financeiro</h1>
            <p className="text-white/80">
              Acompanhe o crescimento da sua clínica em tempo real
            </p>
            {dashboardData.updatedAt && (
              <p className="text-white/60 text-xs mt-1">
                Atualizado em:{" "}
                {new Date(dashboardData.updatedAt).toLocaleString("pt-BR")}
              </p>
            )}
          </div>

          {/* Filtro de Período */}
          <div className="flex gap-2 bg-white/10 p-1 rounded-xl backdrop-blur-sm">
            {[
              { id: "daily", label: "Hoje" },
              { id: "weekly", label: "Semana" },
              { id: "monthly", label: "Mês" },
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id as PeriodType)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  selectedPeriod === period.id
                    ? "bg-white text-[#1e3a5f] shadow-lg"
                    : "text-white hover:bg-white/20"
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
                  <TrendingUp className="w-4 h-4" />+{crescimentoReceita}%
                </div>
              </div>
              <h3 className="text-white/80 text-sm mb-1">Receita Total</h3>
              <p className="text-3xl font-semibold">
                R$ {data.totalRevenue.toLocaleString("pt-BR")}
              </p>
              <p className="text-white/70 text-xs mt-2">
                {selectedPeriod === "daily"
                  ? "Hoje"
                  : selectedPeriod === "weekly"
                    ? "Esta semana"
                    : "Este mês"}
              </p>
            </div>

            {/* Total de Consultas */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4" />+{crescimentoConsultas}%
                </div>
              </div>
              <h3 className="text-white/80 text-sm mb-1">Total de Consultas</h3>
              <p className="text-3xl font-semibold">
                {data.inPersonConsultations + data.onlineConsultations}
              </p>
              <p className="text-white/70 text-xs mt-2">
                {data.inPersonConsultations} presenciais ·{" "}
                {data.onlineConsultations} online
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
                {data.convertedLeads} de {data.totalLeads} leads
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
                    <h2 className="text-2xl font-semibold">
                      LeadIA está gerando resultados!
                    </h2>
                    <p className="text-white/80">
                      Veja o impacto direto no seu faturamento
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div>
                    <p className="text-white/70 text-sm mb-1">
                      Economia de Tempo
                    </p>
                    <p className="text-2xl font-semibold">40 horas/mês</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">
                      Leads Atendidos 24/7
                    </p>
                    <p className="text-2xl font-semibold">
                      {data.totalLeads} leads
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">ROI Estimado</p>
                    <p className="text-2xl font-semibold">850%</p>
                  </div>
                </div>
              </div>

              <div className="ml-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30">
                  <p className="text-white/80 text-sm mb-2">
                    Receita Gerada pelo LeadIA
                  </p>
                  <p className="text-4xl font-bold">
                    R$ {data.totalRevenue.toLocaleString("pt-BR")}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-green-300">
                    <ArrowUpRight className="w-5 h-5" />
                    <span className="text-sm">
                      +R$ {(data.totalRevenue * 0.235).toFixed(0)} vs mês
                      anterior
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Evolução de Receita */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-[#1e3a5f] text-lg mb-4">
                Evolução de Receita
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.revenueEvolution}>
                  <defs>
                    <linearGradient
                      id="colorReceita"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6eb5d8" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#6eb5d8"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
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
              <h3 className="text-[#1e3a5f] text-lg mb-4">
                Comparativo de Consultas por Semana
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.weeklyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="inPerson"
                    fill="#1e3a5f"
                    radius={[8, 8, 0, 0]}
                    name="Presencial"
                  />
                  <Bar
                    dataKey="online"
                    fill="#6eb5d8"
                    radius={[8, 8, 0, 0]}
                    name="Online"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Distribuição de Consultas */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-[#1e3a5f] text-lg mb-4">
                Distribuição de Consultas
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.consultationDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.consultationDistribution.map(
                      (entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ),
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#1e3a5f] rounded"></div>
                  <span className="text-sm text-gray-600">
                    Presencial: {data.inPersonConsultations}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#6eb5d8] rounded"></div>
                  <span className="text-sm text-gray-600">
                    Online: {data.onlineConsultations}
                  </span>
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
                    R${" "}
                    {(data.totalRevenue * 1.23).toLocaleString("pt-BR", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">
                      Próximo Trimestre
                    </span>
                    <div className="flex items-center gap-1 text-green-300">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm">+45%</span>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold">
                    R${" "}
                    {(data.totalRevenue * 3 * 1.45).toLocaleString("pt-BR", {
                      maximumFractionDigits: 0,
                    })}
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
                    R${" "}
                    {(data.totalRevenue * 12 * 1.3).toLocaleString("pt-BR", {
                      maximumFractionDigits: 0,
                    })}
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
                <h4 className="text-[#1e3a5f] font-semibold">
                  Melhor Desempenho
                </h4>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                Consultas Online cresceram
              </p>
              <p className="text-2xl font-bold text-green-600">+32%</p>
              <p className="text-xs text-gray-500 mt-2">
                Comparado ao período anterior
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-[#1e3a5f] font-semibold">
                  Novos Pacientes
                </h4>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                Captados este período
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {data.convertedLeads}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Taxa de conversão: {taxaConversao}%
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-[#1e3a5f] font-semibold">
                  Tempo Economizado
                </h4>
              </div>
              <p className="text-gray-600 text-sm mb-2">Com automação LeadIA</p>
              <p className="text-2xl font-bold text-purple-600">40h</p>
              <p className="text-xs text-gray-500 mt-2">
                Equivalente a R$ 2.000 em salário
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
