"use client";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaApple, FaFacebook, FaGoogle, FaEnvelope, FaLock } from "react-icons/fa"; // Icons

// Interfaces
interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  data: {
    _id: string;
    role: string;
  };
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (data: LoginData): Promise<LoginResponse> => {
    const res = await axios.post<LoginResponse>("http://localhost:5000/api/auth/login", data);
    return res.data;
  };

  const mutation = useMutation<LoginResponse, AxiosError<ApiErrorResponse>, LoginData>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.data._id);
      localStorage.setItem("role", data.data.role);
      
      if (data.data.role === 'admin') router.push("/admin/dashboard");
      else router.push("/dashboard");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Login failed.";
      alert(errorMessage);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--dm-text-main)]">Welcome Back</h2>
        <p className="mt-1 text-sm text-[var(--dm-text-secondary)]">Sign in to manage your orders</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Email Input with Icon */}
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--dm-primary-blue)] transition-colors">
                <FaEnvelope />
            </div>
            <input 
                type="email" 
                className="w-full h-12 pl-11 pr-4 rounded-[15px] border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-[var(--dm-primary-blue)] focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                placeholder="user@dairymart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>

        {/* Password Input with Icon */}
        <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--dm-primary-blue)] transition-colors">
                <FaLock />
            </div>
            <input 
                type="password" 
                className="w-full h-12 pl-11 pr-4 rounded-[15px] border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-[var(--dm-primary-blue)] focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <div className="text-right mt-2">
                <Link href="#" className="text-xs font-bold text-[var(--dm-primary-blue)] hover:underline">Forgot Password?</Link>
            </div>
        </div>

        <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full h-12 rounded-[15px] bg-[var(--dm-primary-blue)] text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
            {mutation.isPending ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Social Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
        <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider"><span className="bg-white px-3 text-gray-400">Or continue with</span></div>
      </div>

      <div className="flex justify-center gap-3 mb-6">
         <SocialButton icon={<FaGoogle />} />
         <SocialButton icon={<FaFacebook />} />
         <SocialButton icon={<FaApple />} />
      </div>

      <p className="text-center text-sm text-[var(--dm-text-secondary)]">
        Don&apos;t have an account? <Link href="/register" className="font-bold text-[var(--dm-primary-blue)] hover:underline">Register</Link>
      </p>
    </div>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
    return (
        <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600">
            {icon}
        </button>
    )
}