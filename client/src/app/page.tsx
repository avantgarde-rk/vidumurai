"use client";
export const dynamic = "force-dynamic";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-sans)] bg-[#F8F9FC] dark:bg-slate-950 overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <nav className="relative z-10 w-full max-w-7xl mx-auto p-6 flex justify-between items-center">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-blue-600 font-[family-name:var(--font-display)]">Vidumurai</div>
        {/* <Link href="/login" className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-purple-600 transition">Log In</Link> */}
      </nav>

      <main className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-12 md:py-20 gap-12">
        {/* Left: Content */}
        <div className="flex-1 text-center md:text-left space-y-8 animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-purple-100 shadow-sm text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
            Campus Automation v2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Smart Attendance <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Simplified.</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto md:mx-0">
            Bid farewell to paperwork. Empower your campus with AI-driven leave management, real-time Wi-Fi attendance tracking, and seamless automated workflows.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <Link
              href="/login"
              className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-200"
            >
              Get Started
            </Link>
          </div>

          <div style={{ paddingBottom: '2rem' }}></div>
        </div>

        {/* Right: Modern Visual/Graphic */}
        <div className="flex-1 relative w-full max-w-lg aspect-square">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-[3rem] rotate-6 opacity-20 blur-xl"></div>
          <div className="relative h-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-2xl p-8 flex flex-col justify-between overflow-hidden">
            {/* Mock UI snippet inside hero */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="h-2 w-24 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-40 bg-slate-800 rounded"></div>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100"></div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-xl">✓</div>
                <div>
                  <div className="h-3 w-32 bg-slate-800 rounded mb-1"></div>
                  <div className="h-2 w-20 bg-slate-300 rounded"></div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 opacity-60">
                <div className="h-10 w-10 rounded-lg bg-orange-100"></div>
                <div className="space-y-2">
                  <div className="h-3 w-28 bg-slate-300 rounded"></div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200/50 flex justify-between">
              <div className="text-xs font-bold text-slate-400">AI INSIGHTS ACTIVE</div>
              <div className="h-2 w-16 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
