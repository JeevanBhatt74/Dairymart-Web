'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormValues } from '@/lib/definitions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Simulate API call
    console.log("Login Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push('/auth/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="text-gray-400" />
          </div>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-gray-400" />
          </div>
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
      >
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}