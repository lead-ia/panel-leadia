import Link from "next/link";
import {
  Home,
  Users,
  Settings,
  LogOut,
  MessageCircle,
  LayoutDashboard,
} from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/firebase";

interface HeaderProps {
  currentPath: string | null;
  logo: string;
}

export function Header({ currentPath, logo }: HeaderProps) {
  const menuItems = [
    { href: "/dashboard-main/home", label: "Home", icon: Home },
    {
      href: "/dashboard-main/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { href: "/dashboard-main/leads", label: "Leads", icon: MessageCircle },
    { href: "/dashboard-main/patients", label: "Pacientes", icon: Users },
    {
      href: "/dashboard-main/settings",
      label: "Configurações",
      icon: Settings,
    },
  ];

  function handleSignOut() {
    const auth = getAuth(app);
    signOut(auth);
  }

  return (
    <header className="bg-gradient-to-r from-[#1e3a5f] via-[#2a5080] to-[#6eb5d8] border-b border-white/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="leadIA" className="h-10" />
          </div>

          <nav className="flex items-center gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-white text-[#1e3a5f] shadow-lg"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile and Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1712168567859-e24cbc155219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGF2YXRhcnxlbnwxfHx8fDE3NjU0MzE1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Julia Sousa"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
              />
              <span className="text-white">Julia Sousa</span>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
