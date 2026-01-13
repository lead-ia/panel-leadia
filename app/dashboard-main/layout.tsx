import DashboardHeader from "@/components/home/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
      <DashboardHeader />
      <div className="max-w-screen-2xl mx-auto px-3 py-4 flex-1 w-full overflow-hidden">{children}</div>
    </div>
  );
}
