"use client";

import { usePathname } from "next/navigation";
import { Header } from "../core/Header";

export const DASHBOARD_ROUTES = {
  HOME: "/dashboard-main/home",
  DASHBOARD: "/dashboard-main/dashboard",
  LEADS: "/dashboard-main/leads",
  PATIENTS: "/dashboard-main/patients",
  SETTINGS: "/dashboard-main/settings",
} as const;

export type DashboardRoute =
  (typeof DASHBOARD_ROUTES)[keyof typeof DASHBOARD_ROUTES];

function DashboardHeader() {
  const pathname = usePathname();

  return <Header currentPath={pathname} logo={"/logo-light.png"} />;
}

export default DashboardHeader;
