"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Receipt,
  Users,
  Truck,
  Bell,
  BarChart3,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Billing POS", href: "/billing", icon: Receipt },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Smart Alerts", href: "/alerts", icon: Bell },
  { name: "Sales Reports", href: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string>("Admin");

  useEffect(() => {
    const storedUser = localStorage.getItem("medivault_username");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("medivault_token");
    localStorage.removeItem("medivault_username");
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 shadow-xl z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-indigo-600 p-2.5 rounded-xl shadow-md flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">MediVault</h1>
          <p className="text-xs text-indigo-400 font-medium tracking-wide">PHARMACY OS</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-semibold text-sm border border-indigo-500/30">
              {username[0]?.toUpperCase() || "A"}
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-200">{username}</p>
              <p className="text-slate-500">Pharmacist</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
