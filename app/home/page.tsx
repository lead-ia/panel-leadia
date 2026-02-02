"use client";

import DashboardHeader from "@/components/home/dashboard-header";
import { Footer } from "@/components/core/Footer";
import { WhatsAppPanel } from "@/components/home/WhatsAppPanel";
import { CalendarPanel } from "@/components/home/CalendarPanel";

export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
      <DashboardHeader />
      <main className="max-w-screen-2xl mx-auto px-3 py-4 flex-1 w-full overflow-hidden">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 flex-1 overflow-hidden">
            <div className="lg:col-span-1 overflow-hidden">
              <WhatsAppPanel />
            </div>
            <div className="lg:col-span-2 overflow-hidden">
              <CalendarPanel />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
