"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";
import { Customer } from "../../types";
import { Users, Plus, Trash2, X, Check, Mail, Phone, MapPin } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Customer>({ name: "", phone: "", email: "", address: "" });
  const [msg, setMsg] = useState("");

  const loadCustomers = async () => {
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      const saved = await api.createCustomer(form);
      setCustomers([...customers, saved]);
      setIsModalOpen(false);
      setForm({ name: "", phone: "", email: "", address: "" });
      setMsg("Customer registered successfully.");
      setTimeout(() => setMsg(""), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to create customer");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id || !confirm("Delete this customer?")) return;
    try {
      await api.deleteCustomer(id);
      setCustomers(customers.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customer Management</h1>
            <p className="text-sm text-slate-500 mt-1">Directory of clients, contact numbers, and delivery addresses.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-600/20 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>

        {msg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>{msg}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Customer Name</th>
                <th className="py-4 px-6">Phone</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Address</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="py-4 px-6 font-mono text-xs text-slate-400">#{c.id}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{c.name}</td>
                  <td className="py-4 px-6 font-mono text-xs">{c.phone || "—"}</td>
                  <td className="py-4 px-6 text-xs">{c.email || "—"}</td>
                  <td className="py-4 px-6 text-xs text-slate-500">{c.address || "—"}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No customers registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Add Customer</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ramesh Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g., +91 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g., ramesh@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Sector 14, Noida"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-md shadow-indigo-600/20"
                  >
                    Save Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
