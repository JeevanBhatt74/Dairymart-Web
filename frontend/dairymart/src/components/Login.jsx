import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import {
  FaApple,
  FaFacebook,
  FaGoogle,
  FaLeaf,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const loginUser = async (userData) => {
    try {
      const response = await axios.post("/api/v1/auth/login", userData);
      return response.data;
    } catch (error) {
      // Demo mode - simulate successful login
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        console.log("Backend not available, using demo mode");
        return {
          userId: "demo-user-123",
          token: "demo-token-456",
          role: "customer"
        };
      }
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.token === "demo-token-456") {
        alert("Demo Mode: Login successful! 🎉\n(Backend not connected - using demo data)");
      } else {
        alert("Login successful! 🎉");
      }
      console.log("User logged in:", data);
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
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        alert("Demo Mode: Backend not connected.\nUse any email/password to login.");
      } else {
        alert("Login failed. Please check your credentials.");
      }
      console.error("Login error:", error.response?.data || error.message);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Basic client-side validation
    const newErrors = { email: "", password: "" };
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center mr-2 shadow">
            <FaLeaf className="text-white text-lg" />
          </div>
          <span className="text-xl font-bold text-emerald-800">Dairy Go</span>
        </Link>
      </div>

      <div className="relative flex w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Left visual/marketing */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-emerald-600 to-green-400 items-center justify-center text-white p-10">
          <div className="space-y-6 max-w-md">
            <h2 className="text-3xl font-extrabold">Fresh dairy, delivered</h2>
            <p className="text-md opacity-90">Fast delivery, farm-fresh quality. Log in to manage orders and deliveries.</p>
            <img
              src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=60"
              alt="Dairy products"
              className="rounded-lg shadow-lg w-full object-cover h-48"
            />
          </div>
        </div>

        {/* Right form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Back</h2>
            <p className="mb-6 text-center text-gray-500">Sign in to continue to your account</p>



            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-emerald-300">
                  <div className="px-3 text-gray-400"><FaEnvelope /></div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 bg-transparent outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    required
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-emerald-300">
                  <div className="px-3 text-gray-400"><FaLock /></div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-transparent outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="px-3 text-gray-500"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center text-sm">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-emerald-600" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <Link to="#" className="text-sm text-emerald-600 hover:underline">Forgot password?</Link>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-60"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="flex items-center justify-center my-6">
              <span className="w-16 h-px bg-gray-200"></span>
              <span className="mx-2 text-sm text-gray-400">OR</span>
              <span className="w-16 h-px bg-gray-200"></span>
            </div>

            <div className="flex justify-center gap-3">
              <button aria-label="Sign in with Google" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:shadow">
                <FaGoogle className="text-red-500" /> <span className="text-sm">Google</span>
              </button>
              <button aria-label="Sign in with Facebook" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:shadow">
                <FaFacebook className="text-blue-600" /> <span className="text-sm">Facebook</span>
              </button>
            </div>

            <p className="mt-6 text-sm text-center text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-emerald-600 hover:underline">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
