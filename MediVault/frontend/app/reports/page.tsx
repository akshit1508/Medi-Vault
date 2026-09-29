"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";
import { SalesReportItem } from "../../types";
import {
  BarChart3,
  Calendar,
  Printer,
  TrendingUp,
  Download,
  Filter,
} from "lucide-react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"day" | "month" | "year">("day");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState<SalesReportItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await api.getSalesReport(reportType, fromDate || undefined, toDate || undefined);
      setReportData(data);
    } catch (err) {
      console.error("Failed to load report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const totalSales = reportData.reduce((acc, row) => acc + (row.totalSales || 0), 0);
  const maxSales = Math.max(...reportData.map((r) => r.totalSales || 0), 1);

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 print:hidden">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sales & Revenue Reports</h1>
            <p className="text-sm text-slate-500 mt-1">
              Analyze daily, monthly, and annual sales volume with date filtering.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium shadow-md transition-all text-sm self-start md:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>

        {/* Filter Controls (Hidden when printing) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 print:hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchReport();
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Report Frequency
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              >
                <option value="day">Day Wise Summary</option>
                <option value="month">Month Wise Summary</option>
                <option value="year">Year Wise Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-6 rounded-xl font-semibold text-sm transition-all shadow-md shadow-indigo-600/20"
            >
              Filter Records
            </button>
          </form>
        </div>

        {/* Print Header only visible on print */}
        <div className="hidden print:block text-center pb-6 mb-6 border-b border-slate-300">
          <h1 className="text-2xl font-black text-slate-900">MediVault Medical Store</h1>
          <h2 className="text-base font-bold text-slate-700 mt-1 capitalize">{reportType} Wise Sales Report</h2>
          {(fromDate || toDate) && (
            <p className="text-xs text-slate-500 mt-1">
              Period: {fromDate || "Earliest"} to {toDate || "Present"}
            </p>
          )}
        </div>

        {/* KPI Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales In Period</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">₹{totalSales.toFixed(2)}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aggregated Intervals</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{reportData.length} Intervals</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Per Interval</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                ₹{reportData.length > 0 ? (totalSales / reportData.length).toFixed(2) : "0.00"}
              </h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Visual Bar Breakdown & Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Period Breakdown</h2>

          <div className="space-y-4">
            {reportData.map((row, idx) => {
              const percentage = Math.round((row.totalSales / maxSales) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{row.label}</span>
                    <span className="text-slate-900 font-mono font-bold">₹{row.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {reportData.length === 0 && !loading && (
              <p className="text-center py-12 text-slate-400 text-sm">
                No sales records found for the selected time range.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
