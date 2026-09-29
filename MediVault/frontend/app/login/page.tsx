"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";
import { ShieldCheck, Lock, User, AlertCircle, KeyRound, X } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotForm, setForgotForm] = useState({ email: "", phone: "", specialCharacter: "" });
  const [forgotStatus, setForgotStatus] = useState<{ message: string; success: boolean } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await api.login({ username, password });
      localStorage.setItem("medivault_token", res.token);
      localStorage.setItem("medivault_username", res.username);
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Please check your username and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotStatus(null);
    try {
      const res = await api.forgotPassword(forgotForm);
      setForgotStatus({
        message: res.message,
        success: res.success,
      });
    } catch (err: any) {
      setForgotStatus({
        message: err.message || "Recovery failed.",
        success: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30 mb-3 text-white">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">MediVault Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Smart Expiry & Pharmacy Management System</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(true);
                  setForgotStatus(null);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all mt-2"
          >
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Create an Account
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal (Replaces legacy ForgotPassword.java) */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">Account Recovery</h3>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotStatus && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
                  forgotStatus.success
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                <span>{forgotStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@example.com"
                  value={forgotForm.email}
                  onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
                  value={forgotForm.phone}
                  onChange={(e) => setForgotForm({ ...forgotForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Special Recovery Keyword *</label>
                <input
                  type="text"
                  required
                  placeholder="Your special recovery keyword"
                  value={forgotForm.specialCharacter}
                  onChange={(e) => setForgotForm({ ...forgotForm, specialCharacter: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-md shadow-indigo-600/20"
                >
                  Verify Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
