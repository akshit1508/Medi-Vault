import Link from "next/link";
import {
  ShieldCheck,
  Bell,
  Package,
  Receipt,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">MediVault</h1>
            <p className="text-xs text-indigo-400 font-semibold">SMART PHARMACY OS</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-300 mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Next-Generation Medical Store & Expiry Prevention Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
          Smart Expiry Alert & <br />
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
            Full Pharmacy Solution
          </span>
        </h1>

        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          MediVault completely modernizes pharmaceutical inventory management with automated 15-day expiry
          notifications, atomic point-of-sale billing, vendor directories, and real-time revenue analytics.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/25 transition-all text-base flex items-center justify-center space-x-2"
          >
            <span>Launch MediVault</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-2xl border border-slate-800 transition-all text-base"
          >
            Account Login
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Smart Expiry Warnings</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Automated triggers detect drugs expiring in 15 days or less to prevent revenue loss.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">POS Billing & Thermal Print</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Instant shopping cart calculations with safe atomic inventory deduction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Multi-Criteria Search</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Find medicines instantly by brand name, formulation type, batch code, or letter index.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Sales Visualizer</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Filter sales performance by day, month, or year with printable audit reports.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-xs text-slate-600 border-t border-slate-900">
        MediVault &copy; 2026. Powered by Java Spring Boot 3 & Next.js 14.
      </footer>
    </div>
  );
}
