"use client";

import { Footer } from "@/components/core/Footer";
import { WhatsAppPanel } from "@/components/home/WhatsAppPanel";
import { CalendarPanel } from "@/components/home/CalendarPanel";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden px-3 py-4 min-h-0">
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
    </div>
  );
}
