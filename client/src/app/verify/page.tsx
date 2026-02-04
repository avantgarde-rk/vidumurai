"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { QrCode, Search, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

/* OUTER COMPONENT */
export default function VerifyPass() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyInner />
    </Suspense>
  );
}

/* INNER COMPONENT (REAL LOGIC) */
function VerifyInner() {
  const searchParams = useSearchParams();   // ✅ SAFE HERE
  const urlId = searchParams.get("id");

  const [qrInput, setQrInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlId) {
      setQrInput(urlId);
      verify(urlId);
    }
  }, [urlId]);

  const verify = async (id: string) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.post("/features/gatepass/verify", {
        qrString: id,
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput) return;
    verify(qrInput);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-6 text-center">
          <h1 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            <QrCode className="text-teal-400" />
            Security Scanner
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Authorized Personnel Only
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleVerify} className="relative mb-6">
            <input
              type="text"
              placeholder="Scan or Paste GP-ID..."
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 pl-10 font-mono text-center"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-teal-600 text-white py-3 rounded-xl"
            >
              {loading ? "Verifying..." : "VERIFY PASS"}
            </button>
          </form>

          {error && (
            <motion.div className="bg-red-50 p-4 rounded-xl text-center">
              <XCircle className="mx-auto text-red-500 mb-2" size={32} />
              <p className="text-red-500">{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div className="bg-green-50 p-6 rounded-xl text-center">
              <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
              <h2 className="text-2xl font-bold text-green-700">
                ACCESS GRANTED
              </h2>
              <p className="text-xs text-green-600 mb-4">
                Valid Gate Pass
              </p>

              <p className="text-sm">
                Name: {result.student?.name}
              </p>
              <p className="text-sm">
                Reg No: {result.student?.regNo}
              </p>
              <p className="text-sm">
                Out Time: {result.expectedOutTime}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
