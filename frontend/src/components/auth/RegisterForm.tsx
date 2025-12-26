'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterFormValues } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    console.log("Register Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <div className="relative mt-1">
          <FaUser className="absolute left-3 top-3 text-gray-400" />
          <input {...register('name')} placeholder="John Doe" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="relative mt-1">
          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          <input {...register('email')} placeholder="you@example.com" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <div className="relative mt-1">
          <FaPhone className="absolute left-3 top-3 text-gray-400" />
          <input {...register('phone')} placeholder="9812345678" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative mt-1">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input type="password" {...register('password')} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative mt-1">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input type="password" {...register('confirmPassword')} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
      >
        {isSubmitting ? 'Register' : 'Register'}
      </button>
    </form>
  );
}