"use client";

import React, { useState, useEffect } from "react";
import { PROPERTY } from "../../lib/config/property";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TrendingUp, Calendar, Clock, ShieldAlert, Check, X, Eye, LogOut, User, Phone, Mail, Coins, Loader2 } from "lucide-react";

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  pax_count: number;
  total_price: number;
  reservation_fee: number;
  status: "pending" | "confirmed" | "rejected";
  payment_receipt_url: string;
  special_requests?: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "confirmed">("all");
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  
  // Start with an empty array and add a loading state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch live data from Supabase immediately when the page loads
  useEffect(() => {
    const fetchLiveBookings = async () => {
      try {
        const res = await fetch("/api/admin/bookings");
        const json = await res.json();
        if (json.bookings) {
          setBookings(json.bookings);
        }
      } catch (err) {
        toast.error("Failed to connect to live database.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchLiveBookings();
  }, []);

  const metrics = {
    totalRevenue: bookings.filter(b => b.status === "confirmed").reduce((acc, b) => acc + Number(b.total_price), 0),
    collectedDeposits: bookings.filter(b => b.status === "confirmed").reduce((acc, b) => acc + Number(b.reservation_fee), 0),
    pendingApprovals: bookings.filter(b => b.status === "pending").length,
    confirmedStays: bookings.filter(b => b.status === "confirmed").length
  };

  const handleStatusChange = async (id: string, nextStatus: "confirmed" | "rejected") => {
    try {
      // Send the status update to the live database
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus })
      });
      
      if (!res.ok) throw new Error("Failed to update database");

      // Update the screen instantly
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: nextStatus } : b));
      
      if (nextStatus === "confirmed") {
        toast.success(`Booking approved! System updated.`);
      } else {
        toast.error(`Booking marked as rejected.`);
      }
    } catch (err) {
      toast.error("System synchronization failed.");
    }
  };

  const handleLogout = () => {
    toast.info("Session closed. Returning to portal authorization gate.");
    router.push("/admin/login");
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === "pending") return b.status === "pending";
    if (activeTab === "confirmed") return b.status === "confirmed";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-gray-900 text-white shadow-md border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider shadow-inner">
              Console
            </span>
            <h1 className="text-base font-black tracking-tight">{PROPERTY.name} Management</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-400 transition-colors bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/60">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Gross Confirmed Revenue</span>
              <span className="text-2xl font-black text-gray-900">₱{metrics.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Collected Downpayments</span>
              <span className="text-2xl font-black text-gray-900">₱{metrics.collectedDeposits.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-600"><Coins className="w-5 h-5" /></div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pending Verifications</span>
              <span className="text-2xl font-black text-amber-600">{metrics.pendingApprovals}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-600"><Clock className="w-5 h-5" /></div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Confirmed Bookings</span>
              <span className="text-2xl font-black text-indigo-600">{metrics.confirmedStays}</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600"><Calendar className="w-5 h-5" /></div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-1.5 bg-gray-200/60 p-1 rounded-xl border">
              <button onClick={() => setActiveTab("all")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "all" ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}>All Records</button>
              <button onClick={() => setActiveTab("pending")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "pending" ? 'bg-amber-600 text-white shadow-xs' : 'text-gray-500 hover:text-amber-600'}`}>Pending ({metrics.pendingApprovals})</button>
              <button onClick={() => setActiveTab("confirmed")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "confirmed" ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-500 hover:text-emerald-600'}`}>Approved ({metrics.confirmedStays})</button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/70 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  <th className="px-6 py-3.5">Guest Information</th>
                  <th className="px-6 py-3.5">Stay Dates</th>
                  <th className="px-6 py-3.5">Pax</th>
                  <th className="px-6 py-3.5">Billing</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {isFetching ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-400 font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        Fetching live database records...
                      </div>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 font-medium">
                      Zero matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4.5 space-y-1 max-w-[240px]">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {b.guest_name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5 font-mono"><Phone className="w-3 h-3 text-gray-400 shrink-0" /> {b.guest_phone}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5 font-mono truncate"><Mail className="w-3 h-3 text-gray-400 shrink-0" /> {b.guest_email}</div>
                      </td>
                      <td className="px-6 py-4.5 space-y-1">
                        <div className="font-semibold text-gray-900 flex flex-col gap-0.5 font-mono text-xs">
                          <span>In: {b.check_in}</span>
                          <span>Out: {b.check_out}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 font-mono font-bold text-gray-700">{b.pax_count} pax</td>
                      <td className="px-6 py-4.5 space-y-0.5 font-mono text-xs">
                        <div className="font-bold text-gray-900">Total: ₱{Number(b.total_price).toLocaleString()}</div>
                        <div className="text-emerald-600 font-medium">Dp: ₱{Number(b.reservation_fee).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          b.status === "confirmed" ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          b.status === "rejected" ? 'bg-red-50 text-red-700 border border-red-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>{b.status}</span>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedReceipt(b.payment_receipt_url)} className="p-1.5 rounded-lg border bg-white hover:bg-gray-50 text-gray-600 transition-all shadow-xs"><Eye className="w-4 h-4" /></button>
                          {b.status === "pending" && (
                            <>
                              <button onClick={() => handleStatusChange(b.id, "confirmed")} className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all shadow-xs"><Check className="w-4 h-4" /></button>
                              <button onClick={() => handleStatusChange(b.id, "rejected")} className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-all shadow-xs"><X className="w-4 h-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative border">
            <button onClick={() => setSelectedReceipt(null)} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-all"><X className="w-4 h-4" /></button>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-blue-600" /> Payment Audit Validation</h3>
            <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border">
              <img src={selectedReceipt} alt="Receipt" className="w-full h-full object-contain bg-gray-950" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}