import dynamic from "next/dynamic";
import LoginFormNew from "../_components/LoginFormNew";
import loginAnimation from "@/assests/Login.json";

const LottieAnimation = dynamic(() => import("@/app/_components/LottieAnimation"), {
  loading: () => <div className="w-full h-full bg-linear-to-br from-blue-50 to-cyan-50" />,
});

import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden relative">
      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-medium text-[--dm-text-secondary] hover:text-[--dm-primary-blue] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        Back to Home
      </Link>
      {/* Left Side - Animation Display */}
      <div className="hidden lg:flex w-1/2 bg-[--dm-bg-main] items-center justify-center relative p-10">
        <div className="w-full max-w-lg">
          <LottieAnimation animationData={loginAnimation} />
        </div>
        {/* Background blobs for depth without messing layout */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-300/20 rounded-full blur-[120px]" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto bg-white">
        <div className="w-full max-w-xl flex flex-col justify-center min-h-[600px]">
          {/* Brand Logo - Moved from Layout */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex justify-center">
              <Image src="/logo.png" alt="DairyMart Logo" width={125} height={125} className="object-contain" />
            </div>
          </div>

          <LoginFormNew />

          {/* Footer Links - Moved from Layout */}
          <div className="mt-12 text-center text-xs text-[--dm-text-secondary]">
            <a href="/" className="hover:text-[--dm-primary-blue] transition-colors">Back to Home</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-[--dm-primary-blue] transition-colors">Privacy Policy</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-[--dm-primary-blue] transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}
