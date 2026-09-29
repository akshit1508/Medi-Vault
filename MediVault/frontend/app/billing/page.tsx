"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";
import { Product, BillItemRequest, BillResponse } from "../../types";
import {
  Receipt,
  ShoppingCart,
  Plus,
  Trash2,
  Printer,
  CheckCircle2,
  AlertCircle,
  History,
  X,
  CreditCard,
} from "lucide-react";

export default function BillingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pastBills, setPastBills] = useState<BillResponse[]>([]);
  const [activeTab, setActiveTab] = useState<"pos" | "history">("pos");

  // Cart & Form
  const [firmName, setFirmName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<BillItemRequest[]>([]);

  // Modals & Feedback
  const [generatedBill, setGeneratedBill] = useState<BillResponse | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = async () => {
    try {
      const [prodList, billList] = await Promise.all([
        api.getProducts().catch(() => []),
        api.getAllBills().catch(() => []),
      ]);
      setProducts(prodList);
      setPastBills(billList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddToCart = () => {
    setErrorMsg("");
    if (!selectedProductId) {
      setErrorMsg("Please select a medicine.");
      return;
    }
    const product = products.find((p) => String(p.id) === selectedProductId);
    if (!product) return;

    if (quantity < 1) {
      setErrorMsg("Quantity must be at least 1.");
      return;
    }

    if (quantity > product.quantity) {
      setErrorMsg(`Insufficient stock! Only ${product.quantity} units available.`);
      return;
    }

    // Check if already in cart
    const existingIndex = cart.findIndex((item) => item.productName === product.name);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      const newQty = updatedCart[existingIndex].quantity + quantity;
      if (newQty > product.quantity) {
        setErrorMsg(`Cannot add more than ${product.quantity} units in total.`);
        return;
      }
      updatedCart[existingIndex].quantity = newQty;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          productName: product.name,
          quantity: quantity,
          price: product.price,
        },
      ]);
    }

    setSelectedProductId("");
    setQuantity(1);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const grandTotal = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const handleCheckout = async () => {
    setErrorMsg("");
    if (!firmName.trim()) {
      setErrorMsg("Please enter the Customer / Firm Name.");
      return;
    }
    if (cart.length === 0) {
      setErrorMsg("Cart is empty! Add products before checking out.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.checkout({
        firmName: firmName.trim(),
        items: cart,
        total: grandTotal,
      });

      setGeneratedBill(response);
      setIsInvoiceOpen(true);
      setCart([]);
      setFirmName("");
      loadData(); // reload updated stock and bills
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process transaction.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Point of Sale (POS) Billing</h1>
            <p className="text-sm text-slate-500 mt-1">
              Create customer invoices, manage shopping carts, and print receipts.
            </p>
          </div>
          <div className="flex bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("pos")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "pos" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Billing Terminal</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "history" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Invoices History</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === "pos" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Input Selection */}
            <div className="space-y-6">
              {/* Firm Name */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Customer / Firm Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Healthcare, John Doe"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                />
              </div>

              {/* Add Medicine to Cart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Add Medication</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Select Medicine</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">-- Choose from inventory --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                        {p.name} - ₹{p.price} ({p.quantity > 0 ? `${p.quantity} in stock` : "Out of stock"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Right: Cart Table & Summary */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-800">Order Cart ({cart.length} items)</h3>
                  </div>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-xs text-rose-600 hover:underline font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-400 uppercase text-xs">
                      <tr>
                        <th className="py-3 px-4">Medicine</th>
                        <th className="py-3 px-4 text-center">Qty</th>
                        <th className="py-3 px-4 text-right">Price</th>
                        <th className="py-3 px-4 text-right">Total</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cart.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{item.productName}</td>
                          <td className="py-3.5 px-4 text-center font-mono">{item.quantity}</td>
                          <td className="py-3.5 px-4 text-right text-slate-500 font-mono">₹{item.price}</td>
                          <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                            ₹{(item.quantity * item.price).toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleRemoveFromCart(idx)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {cart.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                            Shopping cart is empty. Select medicines on the left to add.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Checkout Bar */}
              <div className="pt-6 border-t border-slate-100 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 font-medium">Grand Total</span>
                  <span className="text-3xl font-extrabold text-slate-900">₹{grandTotal.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  disabled={loading || cart.length === 0}
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{loading ? "Processing..." : "Generate Bill & Print"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Past Invoices History (Replaces legacy BillItemTable.java) */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-slate-500 uppercase text-xs border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-6 font-semibold">Bill ID</th>
                    <th className="py-4 px-6 font-semibold">Customer / Firm</th>
                    <th className="py-4 px-6 font-semibold">Date & Time</th>
                    <th className="py-4 px-6 font-semibold">Items</th>
                    <th className="py-4 px-6 font-semibold">Total Amount</th>
                    <th className="py-4 px-6 font-semibold text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pastBills.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-slate-400">#{b.id}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">{b.firmName}</td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                        {new Date(b.billDate).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {b.items?.map((it) => `${it.productName} (x${it.quantity})`).join(", ") || "—"}
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-700">₹{b.totalAmount.toFixed(2)}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setGeneratedBill(b);
                            setIsInvoiceOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pastBills.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No previous bills recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRINTABLE INVOICE MODAL (Replaces legacy GenerateBill HTML output) */}
        {isInvoiceOpen && generatedBill && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 print:shadow-none print:border-none print:max-w-none print:p-0">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-sm">Transaction Successful</span>
                </div>
                <button
                  onClick={() => setIsInvoiceOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Area */}
              <div className="my-6 space-y-4">
                <div className="text-center pb-4 border-b border-slate-200">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">MediVault Pharmacy</h2>
                  <p className="text-xs text-slate-500">Official Retail & Wholesale Invoice</p>
                </div>

                <div className="grid grid-cols-2 text-xs text-slate-600 gap-2 pb-2">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase">Billed To:</span>
                    <p className="font-bold text-slate-900 text-sm">{generatedBill.firmName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 font-semibold uppercase">Invoice No:</span>
                    <p className="font-mono font-bold text-slate-900">#INV-{generatedBill.id}</p>
                    <p className="text-slate-400">{new Date(generatedBill.billDate).toLocaleString()}</p>
                  </div>
                </div>

                <table className="w-full text-left text-xs border-t border-b border-slate-200">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase font-semibold">
                      <th className="py-2 px-2">Item</th>
                      <th className="py-2 px-2 text-center">Qty</th>
                      <th className="py-2 px-2 text-right">Unit Price</th>
                      <th className="py-2 px-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {generatedBill.items?.map((it) => (
                      <tr key={it.id}>
                        <td className="py-2 px-2 font-medium text-slate-800">{it.productName}</td>
                        <td className="py-2 px-2 text-center font-mono">{it.quantity}</td>
                        <td className="py-2 px-2 text-right font-mono">₹{it.price}</td>
                        <td className="py-2 px-2 text-right font-bold text-slate-900 font-mono">
                          ₹{(it.quantity * it.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-slate-700">Net Amount Paid:</span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{generatedBill.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action buttons (hidden during print) */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 print:hidden">
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(false)}
                  className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center space-x-2 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
