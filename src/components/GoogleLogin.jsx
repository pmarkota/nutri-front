import { useGoogleLogin as useGoogleLoginHook } from "@react-oauth/google";

import { API_BASE_URL } from "../config/api";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

import { useState } from "react";

import { jwtDecode } from "jwt-decode";

import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";

// Update the checkUserProfile function
const checkUserProfile = async (token, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}Users/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userId), // Send the GUID directly
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const userProfile = await response.json();
    return !!userProfile.username; // Returns true if username exists, false if null/empty
  } catch (error) {
    console.error("Error checking user profile:", error);
    return false;
  }
};

export default function GoogleLogin() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [password, setPassword] = useState("");

  const [googleData, setGoogleData] = useState(null);

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);

  // Update the handleExistingGoogleUser function
  const handleExistingGoogleUser = async (userData) => {
    try {
      console.log("Attempting Google login with:", userData.email);

      const response = await fetch(`${API_BASE_URL}auth/google/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: userData.accessToken,
          email: userData.email,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Google login failed");
      }

      const token = await response.text();
      authLogin(token);

      // Decode token to get userId
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;

      // Check if user has a username
      const hasUsername = await checkUserProfile(token, userId);

      if (!hasUsername) {
        setUserId(userId);
        setShowUsernameModal(true);
      } else {
        toast.success("Successfully logged in!");
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.message || "Failed to login");
      console.error("Google login error:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!password || !googleData) {
      toast.error("Please enter a password");

      return;
    }

    try {
      console.log("Sending registration request with data:", {
        ...googleData,

        password: password,
      });

      const response = await fetch(`${API_BASE_URL}Users/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: googleData.email,

          name: googleData.name,

          password: password,

          googleId: googleData.googleId,

          picture: googleData.picture,

          lastLogin: new Date().toISOString(),
        }),
      });

      // First check if we can parse the response as JSON
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // If not JSON, get the response as text
        data = await response.text();
        console.log("Non-JSON response:", data);
      }

      if (!response.ok) {
        throw new Error(
          typeof data === "object"
            ? data.message
            : data || "Registration failed"
        );
      }

      toast.success("Registration successful!");

      // After successful registration, log the user in

      await handleExistingGoogleUser(googleData);

      setShowPasswordModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to register");

      console.error("Registration error:", error);
    }
  };

  const googleLogin = useGoogleLoginHook({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",

          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = await userInfoResponse.json();

        const userData = {
          accessToken: tokenResponse.access_token,

          email: userInfo.email,

          googleId: userInfo.sub,

          name: userInfo.name,

          picture: userInfo.picture,
        };

        // Check if user exists

        const checkResponse = await fetch(
          `${API_BASE_URL}auth/google/check-email`,

          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({ email: userInfo.email }),
          }
        );

        const checkData = await checkResponse.json();

        if (checkResponse.ok && checkData.exists) {
          // User exists, proceed with login

          await handleExistingGoogleUser(userData);
        } else {
          // New user, show password modal

          setGoogleData(userData);

          setShowPasswordModal(true);
        }
      } catch (error) {
        toast.error("Failed to get Google user info");

        console.error("Google login error:", error);
      }
    },

    onError: (error) => {
      console.error("Google OAuth Error:", error);

      toast.error("Failed to login with Google");
    },

    scope: "email profile openid",

    flow: "implicit",
  });

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    try {
      console.log("Updating profile with:", { userId, username });
      const response = await fetch(`${API_BASE_URL}Users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: userId,
          username: username,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Profile update error response:", errorText);
        throw new Error("Failed to update username");
      }

      toast.success("Welcome to NutriApp!");
      setShowUsernameModal(false);
      navigate("/home");
    } catch (error) {
      toast.error(error.message || "Failed to update username");
      console.error("Username update error:", error);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => googleLogin()}
        className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 
          text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 
          rounded-md px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 
          dark:focus:ring-offset-gray-800 transition-all duration-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />

          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />

          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />

          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
              Set Password
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Please set a password to complete your registration
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mb-4 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                dark:focus:ring-emerald-400 dark:focus:border-emerald-400
                outline-none transition-all duration-200"
              placeholder="Enter password"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePasswordSubmit}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-md hover:opacity-90 transition-opacity duration-200"
              >
                Complete Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {showUsernameModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-xl"
          >
            <div className="space-y-6">
              <div className="text-center">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="h-20 w-20 mx-auto mb-4 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent"
                >
                  Welcome to NutriApp!
                </motion.h3>

                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  Choose a username to complete your profile
                </motion.p>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                    dark:focus:ring-emerald-400 dark:focus:border-emerald-400
                    outline-none transition-all duration-200
                    pl-12"
                  placeholder="Enter username"
                  autoFocus
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  @
                </span>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={handleUsernameSubmit}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 
                  text-white rounded-lg font-medium
                  transform transition-all duration-200
                  hover:from-emerald-600 hover:to-cyan-600
                  hover:scale-[1.02] active:scale-[0.98]
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                  shadow-lg hover:shadow-xl
                  group"
              >
                <span className="flex items-center justify-center gap-2">
                  Get Started
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
