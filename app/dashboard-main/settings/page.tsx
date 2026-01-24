"use client";

import { SettingsPage } from "@/components/settings/SettingsPage";

export default function Page() {
  return (
    <div className="flex-1 overflow-hidden px-3 py-4 flex flex-col min-h-0">
      <SettingsPage />
    </div>
  );
}
