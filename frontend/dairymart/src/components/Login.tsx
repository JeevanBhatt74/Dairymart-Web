import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaApple, FaFacebook, FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import dairyImage from '../assets/login.jpg';

// Type definitions
interface LoginResponse {
  userId: string;
  token: string;
  role: 'customer' | 'admin';
}

interface LoginPayload {
  email: string;
  password: string;
}

// Global Theme Constants
const PRIMARY_COLOR = '#29ABE2';
const BG_GRAY = '#E6E7E8';

// Type guard to safely check error properties (Fixes TypeScript error)
const isAxiosErrorWithInfo = (e: unknown): e is AxiosError & { code?: string, message: string, response?: { data: { message?: string } } } => {
  return typeof e === 'object' && e !== null && 'message' in e;
};


const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginPayload>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const loginUser = async (userData: LoginPayload): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>('/api/v1/auth/login', userData);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosErrorWithInfo(error)) {
        // Correctly handling demo mode connection error
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          console.warn("Backend not available, using demo mode");
          return { userId: "demo-user-123", token: "demo-token-456", role: "customer" };
        }
      }
      throw error;
    }
  };

  const mutation = useMutation<LoginResponse, AxiosError, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      if (data.role === "admin") {
        window.location.href = "/admin/dashboard"; 
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      // Error handling logic is kept minimal here, relying on the rendering section for display.
      console.error("Login failed:", error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ email: '', password: '' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic client-side validation
    const newErrors = { email: "", password: "" };
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;
    
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: BG_GRAY }}>
      <div className="relative flex w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        
        {/* Left Side - Themed Marketing/Visual Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center text-white p-12" style={{ backgroundColor: PRIMARY_COLOR }}>
          <div className="relative z-10 space-y-4 max-w-md">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight">DairyMart</h2>
            <p className="text-lg opacity-90">
              Fresh dairy products delivered right to your door. Log in to manage your daily orders and delivery schedule.
            </p>
            <img 
              src={dairyImage} 
              alt="Fresh Milk" 
              className="mt-6 rounded-xl shadow-lg border-2 border-white/50"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              Sign In
            </h2>
            <p className="mb-8 text-center text-gray-500 mt-2">
              Welcome back! Please sign into your account.
            </p>

            {/* Error/Demo Notice Display */}
            {mutation.isSuccess && mutation.data.token === "demo-token-456" && (
                <div className="mb-6 p-3 rounded-lg text-sm text-center font-medium bg-blue-50 text-blue-600 border border-blue-200">
                    Demo Mode: Login successful! (Backend not connected)
                </div>
            )}
            {mutation.isError && (
              <div className="mb-6 p-3 rounded-lg text-sm text-center font-medium bg-red-50 text-red-600 border border-red-200">
                {mutation.error?.message?.includes('Network Error') 
                    ? "Login failed: Could not connect to backend." 
                    : "Login failed. Please check your credentials."} 
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 ring-dairy-primary focus:border-transparent transition-all`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 ring-dairy-primary focus:border-transparent transition-all`}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-dairy-primary"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-600">
                  <input type="checkbox" className="h-4 w-4 text-dairy-primary border-gray-300 rounded focus:ring-dairy-primary" />
                  <span className="ml-2">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium hover:underline text-dairy-primary">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 bg-dairy-primary"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="flex items-center justify-center my-6">
              <span className="w-1/5 h-px bg-gray-300"></span>
              <span className="mx-2 text-sm text-gray-500">OR</span>
              <span className="w-1/5 h-px bg-gray-300"></span>
            </div>

            <div className="flex justify-center space-x-4">
              <button aria-label="Sign in with Google" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition">
                <FaGoogle className="text-red-500" /> <span className="text-sm font-medium">Google</span>
              </button>
              <button aria-label="Sign in with Facebook" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition">
                <FaFacebook className="text-blue-600" /> <span className="text-sm font-medium">Facebook</span>
              </button>
              <button aria-label="Sign in with Apple" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition">
                <FaApple className="text-gray-900" /> <span className="text-sm font-medium">Apple</span>
              </button>
            </div>

            <p className="mt-8 text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold hover:underline text-dairy-primary">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;