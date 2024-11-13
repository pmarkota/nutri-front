import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import toast from "react-hot-toast";
import GoogleLogin from "../components/GoogleLogin";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}Users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Login failed");
      }

      const token = await response.text();
      login(token);
      toast.success("Successfully logged in!");
      navigate("/home");
    } catch (error) {
      toast.error(error.message || "Failed to login");
      console.error("Login error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
        >
          <div className="text-center space-y-2">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent"
            >
              Welcome Back
            </motion.h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign in to continue your journey
            </p>
          </div>

          {/* Centered text and button */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?
            </p>
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center px-6 py-2 overflow-hidden rounded-lg 
              bg-gradient-to-r from-emerald-500 to-cyan-500 font-medium text-white 
              transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl active:scale-95"
            >
              {/* Spotlight effect */}
              <span
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent 
                -translate-x-[100%] group-hover:translate-x-[100%] duration-1000 ease-out"
              />

              {/* Text and icon */}
              <span className="flex items-center gap-2">
                <span>Create an account</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Link>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative group"
              >
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2"
                >
                  Email
                </label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                      focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                      dark:focus:ring-emerald-400 dark:focus:border-emerald-400
                      transition-all duration-200
                      dark:focus:bg-gray-700"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
              >
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                      focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                      dark:focus:ring-emerald-400 dark:focus:border-emerald-400
                      transition-all duration-200
                      dark:focus:bg-gray-700"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 
                  bg-gradient-to-r from-emerald-500 to-cyan-500 
                  hover:from-emerald-600 hover:to-cyan-600
                  text-white text-sm font-semibold rounded-lg
                  transform transition-all duration-200 ease-in-out
                  hover:scale-[1.02] active:scale-[0.98]
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-emerald-200 group-hover:text-emerald-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </span>
                Sign in
              </button>
            </motion.div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <GoogleLogin />
          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
}
