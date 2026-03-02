export interface DashboardPeriodData {
  inPersonConsultations: number;
  onlineConsultations: number;
  convertedLeads: number;
  totalLeads: number;
  totalRevenue: number;
}

export interface RevenueEvolution {
  day: string;
  revenue: number;
  consultations: number;
}

export interface WeeklyComparison {
  week: string;
  inPerson: number;
  online: number;
  revenue: number;
}

export interface ConsultationDistribution {
  name: string;
  value: number;
  color: string;
}

export interface DashboardData {
  tenantId: string;
  daily: DashboardPeriodData;
  weekly: DashboardPeriodData;
  monthly: DashboardPeriodData;
  revenueEvolution: RevenueEvolution[];
  weeklyComparison: WeeklyComparison[];
  consultationDistribution: ConsultationDistribution[];
  revenueGrowth: number;
  consultationGrowth: number;
  updatedAt: string;
}

export interface IDashboardRepository {
  getDashboardData(tenantId?: string): Promise<DashboardData>;
}

export class DashboardRepository implements IDashboardRepository {
  private baseUrl = "/api/dashboard";

  async getDashboardData(tenantId: string = "default"): Promise<DashboardData> {
    try {
      const url = new URL(this.baseUrl, window.location.origin);
      url.searchParams.append("tenantId", tenantId);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      return await response.json();
    } catch (error) {
      console.error("DashboardRepository.getDashboardData error:", error);
      throw error;
    }
  }
}
