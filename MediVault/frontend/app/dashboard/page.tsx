"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";
import { AlertSummary, Product, BillResponse } from "../../types";
import {
  Package,
  AlertTriangle,
  Flame,
  DollarSign,
  ArrowRight,
  Bell,
  X,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<AlertSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [bills, setBills] = useState<BillResponse[]>([]);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [alertData, productList, billList] = await Promise.all([
          api.getAlertSummary().catch(() => null),
          api.getProducts().catch(() => []),
          api.getAllBills().catch(() => []),
        ]);

        if (alertData) {
          setAlerts(alertData);
          // Auto trigger modal if alerts exist (mimics legacy ExpiryCode popup)
          if (alertData.expiringCount > 0 || alertData.lowStockCount > 0) {
            setShowAlertModal(true);
          }
        }
        setProducts(productList);
        setBills(billList);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalRevenue = bills.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pharmacy Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              MediVault Smart Expiry & Medical Store Management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/billing"
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-600/20 transition-all text-sm"
            >
              <span>Launch POS Billing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total Products */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inventory</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{products.length} Items</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Expiring Alert */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Expiring in 15 Days</p>
              <h3 className="text-2xl font-bold text-amber-700 mt-1">{alerts?.expiringCount ?? 0} Drugs</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Low Stock Alert */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Low Stock Warnings</p>
              <h3 className="text-2xl font-bold text-rose-700 mt-1">{alerts?.lowStockCount ?? 0} Items</h3>
            </div>
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Total Revenue */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Sales</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">₹{totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Action Shortcuts & Live Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Products */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Inventory Status</h2>
              <Link href="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                View All &rarr;
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="py-3 px-4 rounded-l-lg">Product</th>
                    <th className="py-3 px-4">Batch</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Expiry</th>
                    <th className="py-3 px-4 rounded-r-lg">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.slice(0, 6).map((p) => {
                    const isLow = p.quantity <= p.alertThreshold;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{p.name}</td>
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-500">{p.batchNumber || "—"}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              isLow ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {p.quantity} units
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs">{p.expiryDate}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-900">₹{p.price}</td>
                      </tr>
                    );
                  })}
                  {products.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No products added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & Urgent Alerts list */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold">Quick Operations</h3>
              <p className="text-xs text-indigo-200 mt-1 mb-6">
                Fast-track access to store management modules.
              </p>
              <div className="space-y-3">
                <Link
                  href="/billing"
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold transition-all backdrop-blur-sm"
                >
                  <span>Create Customer Bill</span>
                  <ArrowRight className="w-4 h-4 text-indigo-300" />
                </Link>
                <Link
                  href="/products"
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold transition-all backdrop-blur-sm"
                >
                  <span>Add New Medicine</span>
                  <ArrowRight className="w-4 h-4 text-indigo-300" />
                </Link>
                <Link
                  href="/reports"
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold transition-all backdrop-blur-sm"
                >
                  <span>Generate Sales Report</span>
                  <ArrowRight className="w-4 h-4 text-indigo-300" />
                </Link>
              </div>
            </div>

            {/* Expiring Highlights */}
            {alerts && alerts.expiringCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Immediate Expiry Notice</span>
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  {alerts.expiringCount} item(s) are approaching expiry in 15 days or less.
                </p>
                <div className="mt-3 space-y-1.5">
                  {alerts.expiringProducts.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="text-xs bg-white/80 p-2 rounded-lg border border-amber-200 flex justify-between"
                    >
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-amber-700 font-mono font-medium">{item.expiryDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SMART ALERTS MODAL (Replaces legacy ExpiryCode popup) */}
        {showAlertModal && alerts && (alerts.expiringCount > 0 || alerts.lowStockCount > 0) && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">MediVault Special Alerts</h2>
                    <p className="text-xs text-slate-500">Automated safety threshold warnings</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 max-h-96 overflow-y-auto pr-1">
                {/* Expiry section */}
                <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-4">
                  <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Expiry Alerts ({alerts.expiringCount})</span>
                  </h3>
                  {alerts.expiringProducts.length > 0 ? (
                    <div className="space-y-2">
                      {alerts.expiringProducts.map((p) => (
                        <div key={p.id} className="bg-white p-2.5 rounded-xl border border-amber-200/60 text-xs">
                          <p className="font-bold text-slate-800">{p.name}</p>
                          <p className="text-amber-700 mt-0.5">Exp Date: {p.expiryDate}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No drugs expiring soon.</p>
                  )}
                </div>

                {/* Low Stock section */}
                <div className="border border-rose-200 bg-rose-50/50 rounded-2xl p-4">
                  <h3 className="text-sm font-bold text-rose-900 mb-3 flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>Stock Alerts ({alerts.lowStockCount})</span>
                  </h3>
                  {alerts.lowStockProducts.length > 0 ? (
                    <div className="space-y-2">
                      {alerts.lowStockProducts.map((p) => (
                        <div key={p.id} className="bg-white p-2.5 rounded-xl border border-rose-200/60 text-xs">
                          <p className="font-bold text-slate-800">{p.name}</p>
                          <p className="text-rose-700 mt-0.5">
                            Stock: <span className="font-bold">{p.quantity}</span> (Threshold: {p.alertThreshold})
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">All inventory levels normal.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-md transition-all"
                >
                  Acknowledge & Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
