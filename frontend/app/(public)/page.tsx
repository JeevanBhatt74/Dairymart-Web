import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Main Card with Gradient */}
          <div className="relative overflow-hidden rounded-[20px] sm:rounded-[30px] p-8 sm:p-16 shadow-xl shadow-blue-500/20"
               style={{ background: "linear-gradient(135deg, var(--dm-primary-blue), var(--dm-gradient-light))" }}>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-white">
              <div className="space-y-6 text-center lg:text-left">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-medium">
                  🚀 Fresh from Farm to Home
                </span>
                <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
                  Pure Goodness, <br/> Delivered Daily.
                </h1>
                <p className="text-lg text-blue-50 max-w-xl mx-auto lg:mx-0">
                  Experience fresh milk, cheese, and organic dairy products delivered within 30 minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    href="/register" 
                    className="h-14 px-8 inline-flex items-center justify-center bg-white text-[var(--dm-primary-blue)] font-bold rounded-[15px] hover:bg-gray-50 transition-colors shadow-lg"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
              
              {/* Illustration Placeholder */}
              <div className="hidden lg:flex justify-center">
                 <div className="relative w-72 h-72 bg-white/10 backdrop-blur-sm rounded-[30px] border border-white/20 flex items-center justify-center p-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="text-center">
                       <span className="text-8xl block mb-4">🥛</span>
                       <p className="font-semibold text-xl">Pure Milk</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* --- CATEGORIES --- */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {['All Products', 'Fresh Milk', 'Cheese', 'Yogurt', 'Butter', 'Paneer'].map((cat, i) => (
              <button 
                key={cat}
                className={`px-6 py-3 rounded-[15px] text-sm font-semibold whitespace-nowrap transition-all border ${
                  i === 0 
                  ? 'bg-[var(--dm-primary-blue)] text-white border-[var(--dm-primary-blue)] shadow-lg shadow-blue-500/20' 
                  : 'bg-white text-[var(--dm-text-secondary)] border-[var(--dm-border)] hover:border-[var(--dm-primary-blue)] hover:text-[var(--dm-primary-blue)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- POPULAR PRODUCTS --- */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--dm-text-main)]">Popular Products</h2>
              <Link href="#" className="text-[var(--dm-primary-blue)] font-semibold text-sm hover:opacity-80">
                View All &rarr;
              </Link>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Full Cream Milk", price: "$2.50", image: "🥛", tag: "Best Seller" },
                { name: "Cheddar Cheese", price: "$4.00", image: "🧀", tag: null },
                { name: "Fresh Yogurt", price: "$3.15", image: "🥣", tag: "Fresh" },
                { name: "Salted Butter", price: "$5.20", image: "🧈", tag: null },
              ].map((item, i) => (
                <div key={i} className="group bg-white p-4 rounded-[20px] border border-[var(--dm-border)] hover:border-[var(--dm-primary-blue)] hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-[4/3] bg-[var(--dm-bg-light)] rounded-[15px] mb-4 flex items-center justify-center overflow-hidden">
                    {item.tag && (
                      <span className="absolute top-3 left-3 bg-[var(--dm-primary-blue)] text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">
                        {item.tag}
                      </span>
                    )}
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{item.image}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold text-[var(--dm-text-main)] text-lg">{item.name}</h3>
                    <p className="text-sm text-[var(--dm-text-secondary)]">500ml Pack</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-5">
                    <span className="text-xl font-bold text-[var(--dm-text-main)]">{item.price}</span>
                    
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}