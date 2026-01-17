import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--dm-bg-main)] relative overflow-hidden">
      
      {/* Background Decor Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-3xl opacity-50 z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-3xl opacity-50 z-0"></div>

      {/* Brand Logo */}
      <div className="mb-8 z-10 flex flex-col items-center">
        <div className="h-16 w-16 bg-white rounded-2xl shadow-soft flex items-center justify-center text-4xl mb-3">
          🥛
        </div>
        <h1 className="text-2xl font-bold text-[var(--dm-primary-blue)] tracking-tight">DairyMart</h1>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-xl shadow-blue-900/5 p-8 relative z-10 border border-white">
        {children}
      </div>

      {/* Footer Links */}
      <div className="mt-8 text-center text-xs text-[var(--dm-text-secondary)] z-10">
        <Link href="/" className="hover:text-[var(--dm-primary-blue)] transition-colors">Back to Home</Link>
        <span className="mx-2">•</span>
        <Link href="#" className="hover:text-[var(--dm-primary-blue)] transition-colors">Privacy Policy</Link>
        <span className="mx-2">•</span>
        <Link href="#" className="hover:text-[var(--dm-primary-blue)] transition-colors">Terms</Link>
      </div>
    </div>
  );
}