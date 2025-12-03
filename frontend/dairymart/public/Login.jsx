import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { FaApple, FaFacebook, FaGoogle, FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute top-5 left-5">
        <Link to="/" className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-2">
            <FaLeaf className="text-white text-lg" />
          </div>
          <span className="text-xl font-bold text-blue-800">Dairy Go</span>
        </Link>
      </div>
      <div className="relative flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:block w-1/2">
          <img
            src="https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Fresh Dairy Products"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full p-8 md:w-1/2">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Login to Your Account
          </h2>
          <p className="mb-6 text-center text-gray-500">
            Welcome back! Please enter your details.
          </p>

          {/* Demo Mode Notice */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm text-center">
              <strong>Demo Mode:</strong> Backend not connected. Use any email/password to login.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <div className="flex items-center justify-center my-6">
            <span className="w-16 h-px bg-gray-300"></span>
            <span className="mx-2 text-sm text-gray-500">OR</span>
            <span className="w-16 h-px bg-gray-300"></span>
          </div>

          <div className="flex justify-center space-x-4">
            <button className="p-3 text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-100">
              <FaGoogle size={20} />
            </button>
            <button className="p-3 text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-100">
              <FaFacebook size={20} />
            </button>
            <button className="p-3 text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-100">
              <FaApple size={20} />
            </button>
          </div>

          <p className="mt-6 text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
