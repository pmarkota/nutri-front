import { useGoogleLogin } from "@react-oauth/google";
import { API_BASE_URL } from "../config/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function GoogleLogin() {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [googleData, setGoogleData] = useState(null);

  const handleExistingGoogleUser = async (userData) => {
    try {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google login failed");
      }

      localStorage.setItem("token", data.token);
      toast.success("Successfully logged in with Google!");
      navigate("/home");
    } catch (error) {
      toast.error("Failed to login");
      console.error("Google login error:", error);
    }
  };

  const login = useGoogleLogin({
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

        if (checkResponse.ok) {
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

  return (
    <>
      <button
        type="button"
        onClick={() => login()}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl"
          >
            <h3 className="text-lg font-medium mb-2 text-gray-900">
              Set Password
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please set a password to complete your registration
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
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
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-md hover:opacity-90 transition-opacity duration-200"
              >
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
