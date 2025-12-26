import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white text-center p-6">
       {/* Ensure logo exists in public/assets/logo.png */}
      <Image src="/assets/logo.png" width={180} height={180} alt="DairyMart Logo" className="mb-8" />
      
      <h1 className="text-6xl font-extrabold text-primary mb-6">DairyMart</h1>
      <p className="text-xl text-gray-600 max-w-lg mb-10">
        Fresh milk, cheese, and dairy products delivered straight to your doorstep every morning.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:opacity-90 transition hover:scale-105"
        >
          Login
        </Link>
        <Link 
          href="/register" 
          className="px-8 py-3 bg-white text-primary border-2 border-primary font-bold rounded-full hover:bg-blue-50 transition hover:scale-105"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}