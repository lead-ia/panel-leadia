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
import { useAuth } from "@/components/auth/auth-context";
import { useUser } from "@/components/auth/user-context";

interface HeaderProps {
  currentPath: string | null;
  logo: string;
}

export function Header({ currentPath, logo }: HeaderProps) {
  const { user: firebaseUser } = useAuth();
  const { dbUser } = useUser();

  const user = dbUser || firebaseUser;

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
      <div className="px-6 py-4 max-w-full lg:max-w-screen-2xl lg:mx-auto">
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
            {user && (
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={
                      (user as any).name || (user as any).displayName || "User"
                    }
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border-2 border-white/50">
                    {(
                      (user as any).name ||
                      (user as any).displayName ||
                      user.email
                    )?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-white">
                  {(user as any).name ||
                    (user as any).displayName ||
                    user.email}
                </span>
              </div>
            )}

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
