import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-black">
            <div className="glass-card p-12 text-center max-w-lg mx-auto">
                <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    404
                </h1>
                <h2 className="text-2xl font-semibold mt-4 mb-2 text-slate-800 dark:text-white">Page Not Found</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-blue-500/25"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
