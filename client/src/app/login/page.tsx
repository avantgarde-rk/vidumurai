'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [loginType, setLoginType] = useState<'student' | 'staff'>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        // ... (existing existing login handler)
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', { email, password });
            const role = data.role?.toLowerCase();

            // Strict Role Validation
            if (loginType === 'student' && role !== 'student') {
                throw new Error('This portal is for Students only. Please use Staff Login.');
            }
            if (loginType === 'staff' && role === 'student') {
                throw new Error('This portal is for Faculty/HOD only. Please use Student Login.');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            if (role === 'student') router.push('/dashboard/student');
            else if (role === 'mentor') router.push('/dashboard/mentor');
            else if (role === 'hod') router.push('/dashboard/hod');
            else router.push('/dashboard/admin');
        } catch (err: any) {
            setError(err.message || err.response?.data?.message || 'Login failed');
            setLoading(false);
        }
    };

    const handleDemoLogin = async (email: string, pass: string, redirect: string) => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password: pass });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            router.push(redirect);
        } catch (err: any) {
            console.error(err);
            setError('Demo Login Failed. Ensure seed data is run.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Visual Side */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                <div className="relative z-10 max-w-lg text-center lg:text-left">
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                        Welcome to <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">Vidumurai</span>
                    </h1>
                    <p className="text-lg text-purple-100/80 mb-8 leading-relaxed">
                        Your intelligent campus companion. Experience seamless attendance tracking, smart leave management, and automated academic workflows.
                    </p>
                    <div className="flex gap-4 justify-center lg:justify-start">
                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-sm font-medium">Real-time Updates</div>
                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-sm font-medium">Secure Access</div>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center p-8 bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sign in to your account</h2>
                        <p className="text-slate-500 mt-2">Please select your role to continue.</p>
                    </div>

                    {/* Login Type Toggle - Modern Tabs */}
                    <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1.5 rounded-xl">
                        <button
                            onClick={() => { setLoginType('student'); setError(''); }}
                            className={`py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${loginType === 'student' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => { setLoginType('staff'); setError(''); }}
                            className={`py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${loginType === 'staff' ? 'bg-white text-purple-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Faculty / Staff
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg text-sm"
                        >
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 hover:bg-slate-100/50"
                                placeholder={loginType === 'student' ? "student@example.edu" : "faculty@example.edu"}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 hover:bg-slate-100/50 pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500 font-medium">Try Demo Mode</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('student@demo.com', 'demo123', '/dashboard/student')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 hover:border-purple-200 hover:bg-purple-50 transition-all gap-1 group"
                            >
                                <span className="text-xs font-bold text-slate-600 group-hover:text-purple-700">Student</span>
                                <span className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider group-hover:bg-purple-200 group-hover:text-purple-800">View</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDemoLogin('mentor@demo.com', 'demo123', '/dashboard/mentor')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all gap-1 group"
                            >
                                <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">Faculty</span>
                                <span className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider group-hover:bg-blue-200 group-hover:text-blue-800">View</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDemoLogin('hod@demo.com', 'demo123', '/dashboard/hod')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 hover:border-teal-200 hover:bg-teal-50 transition-all gap-1 group"
                            >
                                <span className="text-xs font-bold text-slate-600 group-hover:text-teal-700">HOD</span>
                                <span className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider group-hover:bg-teal-200 group-hover:text-teal-800">View</span>
                            </button>
                        </div>
                    </form>

                    <div className="text-center text-xs text-slate-400 mt-8">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
