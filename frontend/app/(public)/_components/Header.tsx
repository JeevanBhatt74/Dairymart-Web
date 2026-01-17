import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--dm-border)] bg-[var(--dm-surface-white)]/80 backdrop-blur-md">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--dm-primary-blue)]/10 text-2xl">
            🥛
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--dm-primary-blue)]">
            DairyMart
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--dm-text-secondary)]">
          <Link href="/" className="hover:text-[var(--dm-primary-blue)] transition-colors">Home</Link>
          <Link href="/products" className="hover:text-[var(--dm-primary-blue)] transition-colors">Products</Link>
          <Link href="/about" className="hover:text-[var(--dm-primary-blue)] transition-colors">Our Story</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-semibold text-[var(--dm-text-secondary)] hover:text-[var(--dm-primary-blue)]"
          >
            Log in
          </Link>
          <Link 
            href="/register" 
            className="h-10 px-6 inline-flex items-center justify-center bg-[var(--dm-primary-blue)] text-white font-bold text-sm radius-btn hover:opacity-90 shadow-soft transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}