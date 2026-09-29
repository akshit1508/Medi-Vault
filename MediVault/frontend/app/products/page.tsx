"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";
import { Product } from "../../types";
import {
  Package,
  Plus,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  X,
  Check,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [form, setForm] = useState<Product>({
    name: "",
    batchNumber: "",
    category: "General",
    drugType: "Tablet",
    price: 0,
    expiryDate: "",
    description: "",
    alertThreshold: 10,
    quantity: 50,
    expiryAlert: true,
    expiryAlertDate: "",
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      let data: Product[];
      if (selectedLetter) {
        data = await api.getProducts({ prefix: selectedLetter });
      } else if (search.trim()) {
        data = await api.getProducts({ search: search.trim() });
      } else {
        data = await api.getProducts();
      }
      setProducts(data);
    } catch (err: any) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedLetter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedLetter("");
    loadProducts();
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      setSuccessMsg("Product deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to delete product.");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Client-side validations (matching legacy ProductPage.java)
    if (!form.name || !form.price || !form.expiryDate || form.quantity === undefined) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (new Date(form.expiryDate) <= new Date()) {
      setErrorMsg("Expiry date must be in the future.");
      return;
    }

    if (form.alertThreshold >= form.quantity) {
      setErrorMsg("Alert threshold must be strictly less than initial quantity.");
      return;
    }

    try {
      const saved = await api.createProduct(form);
      setProducts([saved, ...products]);
      setIsModalOpen(false);
      setSuccessMsg("Product added successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      setForm({
        name: "",
        batchNumber: "",
        category: "General",
        drugType: "Tablet",
        price: 0,
        expiryDate: "",
        description: "",
        alertThreshold: 10,
        quantity: 50,
        expiryAlert: true,
        expiryAlertDate: "",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create product.");
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medicine Inventory</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage stock, expiry alerts, categories, and batch information.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-600/20 transition-all text-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by drug name, batch number, category, or formulation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              Search
            </button>
            {(search || selectedLetter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedLetter("");
                  loadProducts();
                }}
                className="text-slate-500 hover:text-slate-700 px-4 py-2.5 text-sm font-medium"
              >
                Reset
              </button>
            )}
          </form>

          {/* Alphabet Filter (Replaces legacy Alphabet.java) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2 mb-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                Alphabetical Index (A-Z)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(selectedLetter === letter ? "" : letter)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    selectedLetter === letter
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 uppercase text-xs border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6 font-semibold">ID</th>
                  <th className="py-4 px-6 font-semibold">Medicine Name</th>
                  <th className="py-4 px-6 font-semibold">Batch No</th>
                  <th className="py-4 px-6 font-semibold">Drug Type</th>
                  <th className="py-4 px-6 font-semibold">Price</th>
                  <th className="py-4 px-6 font-semibold">Stock</th>
                  <th className="py-4 px-6 font-semibold">Expiry Date</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const isLow = p.quantity <= p.alertThreshold;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-slate-400">#{p.id}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">{p.name}</td>
                      <td className="py-4 px-6 text-xs font-mono text-slate-600">{p.batchNumber || "—"}</td>
                      <td className="py-4 px-6">
                        <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                          {p.drugType || "General"}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900">₹{p.price}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isLow ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {p.quantity} in stock
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-xs font-mono">{p.expiryDate}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No products found. Click "Add New Product" to populate your inventory.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD PRODUCT MODAL (Replaces legacy Productpage.html) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Add New Medicine</h2>
                    <p className="text-xs text-slate-500">Register new batch and set smart alerts</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreate} className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Paracetamol 500mg"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Batch Number</label>
                    <input
                      type="text"
                      placeholder="e.g., BATCH-2026-X"
                      value={form.batchNumber}
                      onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Drug Formulation</label>
                    <select
                      value={form.drugType}
                      onChange={(e) => setForm({ ...form, drugType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Ointment">Ointment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="0.01"
                      placeholder="e.g., 25.00"
                      value={form.price || ""}
                      onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity in Stock *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={form.quantity || ""}
                      onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date *</label>
                    <input
                      type="date"
                      required
                      value={form.expiryDate}
                      onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Alert Threshold</label>
                    <input
                      type="number"
                      min="0"
                      value={form.alertThreshold}
                      onChange={(e) => setForm({ ...form, alertThreshold: parseInt(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.expiryAlert}
                        onChange={(e) => setForm({ ...form, expiryAlert: e.target.checked })}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Enable Automated Expiry Alerts (15 days notice)</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-md shadow-indigo-600/20 transition-all"
                  >
                    Save Product
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
