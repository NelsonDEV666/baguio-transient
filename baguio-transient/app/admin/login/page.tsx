"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { PROPERTY } from "@/lib/config/property";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Local development bypass check
      if (email === "admin@test.com" && password === "password123") {
        toast.success("Welcome back! Entering local management space.");
        window.location.href = "/admin"; // Hard redirect
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Authentication validated successfully.");
      
      // Force a hard browser navigation so middleware reads the fresh cookie
      window.location.href = "/admin"; 
      
    } catch (err: any) {
      toast.error(err.message || "Invalid administrative login credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Upper Brand Accent */}
        <div className="bg-blue-900 text-white p-6 text-center space-y-1">
          <div className="mx-auto w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center mb-1">
            <Lock className="w-5 h-5 text-blue-300" />
          </div>
          <h1 className="text-xl font-black tracking-tight">{PROPERTY.name}</h1>
          <p className="text-xs text-blue-200">Administrative Portal Hub Access</p>
        </div>

        {/* Input Interface Area */}
        <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@domain.com"
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm font-medium text-gray-950 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Security Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm font-medium text-gray-950 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md text-sm mt-2"
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Authorizing Profile...</>
            ) : (
              "Sign In to Console"
            )}
          </button>
        </form>

        {/* Demo Fallback Alert banner */}
        <div className="bg-gray-50 border-t p-3 text-center text-[11px] text-gray-400">
          Offline test bypass: <span className="font-mono text-gray-600 font-bold">admin@test.com</span> / <span className="font-mono text-gray-600 font-bold">password123</span>
        </div>

      </div>
    </div>
  );
}