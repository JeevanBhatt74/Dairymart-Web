// frontend/app/dashboard/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-black/5 bg-background/80 px-6 backdrop-blur-md dark:border-white/10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              M
            </div>
            <span className="text-lg font-semibold tracking-tight">MyApp Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-sm text-foreground/60 sm:block">
              welcome@example.com
            </div>
            <Link
              href="/"
              className="rounded-md border border-black/10 px-3 py-1.5 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
            >
              Log out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 md:p-10">
        <div className="mx-auto max-w-6xl space-y-8">
          
          {/* Welcome Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-foreground/60">
              Here is an overview of your account activity.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Revenue", value: "$45,231.89", change: "+20.1%", trend: "up" },
              { label: "Subscriptions", value: "+2350", change: "+180.1%", trend: "up" },
              { label: "Sales", value: "+12,234", change: "+19%", trend: "up" },
              { label: "Active Now", value: "+573", change: "+201", trend: "up" },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-xl border border-black/10 bg-background p-6 shadow-sm transition-all hover:shadow-md dark:border-white/10"
              >
                <h3 className="text-sm font-medium text-foreground/60">{stat.label}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-xs font-medium text-emerald-600">
                    {stat.change} from last month
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity / Placeholder Area */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            
            {/* Main Chart Area Placeholder */}
            <div className="col-span-4 rounded-xl border border-black/10 bg-background p-6 shadow-sm dark:border-white/10">
              <h3 className="mb-4 text-lg font-semibold">Overview</h3>
              <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
                <p className="text-sm text-foreground/40">Chart visualization placeholder</p>
              </div>
            </div>

            {/* Recent Sales Placeholder */}
            <div className="col-span-3 rounded-xl border border-black/10 bg-background p-6 shadow-sm dark:border-white/10">
              <h3 className="mb-4 text-lg font-semibold">Recent Sales</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-black/10 dark:bg-white/10" />
                      <div>
                        <p className="text-sm font-medium">User Name</p>
                        <p className="text-xs text-foreground/60">user@email.com</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">+$1,999.00</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}