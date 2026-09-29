"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";
import { AlertSummary } from "../../types";
import {
  Bell,
  Calendar,
  Flame,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertSummary | null>(null);
  const [filter, setFilter] = useState<"all" | "expiry" | "stock">("all");
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlertSummary();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to load alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Notification Center</h1>
            <p className="text-sm text-slate-500 mt-1">
              Active warnings for products nearing expiration or below minimum stock levels.
            </p>
          </div>
          <button
            onClick={fetchAlerts}
            className="inline-flex items-center space-x-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Alerts</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === "all" ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            All Warnings ({(alerts?.expiringCount ?? 0) + (alerts?.lowStockCount ?? 0)})
          </button>
          <button
            onClick={() => setFilter("expiry")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === "expiry" ? "bg-amber-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            Expiry Alerts ({alerts?.expiringCount ?? 0})
          </button>
          <button
            onClick={() => setFilter("stock")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === "stock" ? "bg-rose-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            Low Stock ({alerts?.lowStockCount ?? 0})
          </button>
        </div>

        {/* Alerts Content */}
        <div className="space-y-6">
          {/* Expiry Section */}
          {(filter === "all" || filter === "expiry") && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Products Expiring Within 15 Days ({alerts?.expiringCount ?? 0})
                </h2>
              </div>

              {alerts && alerts.expiringProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {alerts.expiringProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2 text-sm"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900">{p.name}</span>
                        <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-700">
                          {p.batchNumber || "No Batch"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Formulation: <span className="font-medium text-slate-800">{p.drugType || "General"}</span>
                      </p>
                      <div className="pt-2 border-t border-amber-200/60 flex justify-between items-center text-xs">
                        <span className="text-slate-500">Expiry Date:</span>
                        <span className="font-mono font-bold text-amber-800">{p.expiryDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 text-sm flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>No products nearing expiry at this time.</span>
                </div>
              )}
            </div>
          )}

          {/* Low Stock Section */}
          {(filter === "all" || filter === "stock") && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Critical Stock Shortages ({alerts?.lowStockCount ?? 0})
                </h2>
              </div>

              {alerts && alerts.lowStockProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {alerts.lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2 text-sm"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900">{p.name}</span>
                        <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                          {p.quantity} units left
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Alert Threshold: <span className="font-bold text-slate-800">{p.alertThreshold} units</span>
                      </p>
                      <div className="pt-2 border-t border-rose-200/60 flex justify-between items-center text-xs">
                        <span className="text-slate-500">Unit Price:</span>
                        <span className="font-bold text-slate-900">₹{p.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 text-sm flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>All product quantities are above alert thresholds.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
