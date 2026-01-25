"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import DashboardHeader from "@/components/home/dashboard-header";
import { Footer } from "@/components/core/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <div>
        <DashboardHeader />
      </div>
      <main className="flex-1 min-h-0 overflow-hidden flex flex-col max-w-screen-2xl mx-auto w-full">
        {children}
      </main>
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
}
