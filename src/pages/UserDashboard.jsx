import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";
import { jwtDecode } from "jwt-decode";

const StatCard = ({ title, value, icon, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSubmit = () => {
    onUpdate(tempValue);
    setIsEditing(false);
  };

  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 
        border border-gray-100 dark:border-gray-700
        shadow-lg hover:shadow-xl transition-all duration-300 
        transform hover:scale-[1.02]"
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          {isEditing ? (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={handleSubmit}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 
                border border-emerald-200 dark:border-emerald-800 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-emerald-500 dark:focus:ring-emerald-400
                text-gray-900 dark:text-white"
              placeholder={`Enter ${title.toLowerCase()}`}
              autoFocus
            />
          ) : (
            <div
              className="cursor-pointer group flex items-center"
              onClick={() => setIsEditing(true)}
            >
              <p
                className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-500 
                bg-clip-text text-transparent group-hover:opacity-80 transition-opacity"
              >
                {value || "Not set"}
              </p>
              <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                ✏️
              </span>
            </div>
          )}
        </div>
        <div
          className="ml-4 p-3 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 
          dark:from-emerald-500/20 dark:to-cyan-500/20 rounded-lg"
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const ProgressRing = ({ progress, size = 140, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-xl"></div>

      <div className="relative">
        {/* Animated background ring */}
        <svg height={size} width={size} className="transform rotate-90">
          <circle
            className="opacity-20 dark:opacity-10"
            stroke="url(#gradient-bg)"
            fill="none"
            strokeWidth={strokeWidth / 2}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />

          {/* Main progress ring */}
          <circle
            stroke="url(#gradient-main)"
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            className="transition-all duration-700 ease-out"
          >
            <animate
              attributeName="stroke-dashoffset"
              dur="1.5s"
              from={circumference}
              to={strokeDashoffset}
              fill="freeze"
            />
          </circle>

          {/* Secondary decorative ring */}
          <circle
            stroke="url(#gradient-secondary)"
            fill="none"
            strokeWidth={strokeWidth / 4}
            strokeDasharray="4,8"
            r={radius - strokeWidth - 2}
            cx={size / 2}
            cy={size / 2}
            className="opacity-50"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${size / 2} ${size / 2}`}
              to={`360 ${size / 2} ${size / 2}`}
              dur="60s"
              repeatCount="indefinite"
              additive="sum"
            />
          </circle>

          {/* Gradient definitions */}
          <defs>
            <linearGradient
              id="gradient-main"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#10B981">
                <animate
                  attributeName="stop-color"
                  values="#10B981; #0EA5E9; #10B981"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#0EA5E9">
                <animate
                  attributeName="stop-color"
                  values="#0EA5E9; #10B981; #0EA5E9"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <linearGradient
              id="gradient-secondary"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="gradient-bg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Centered content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent">
              {progress}%
            </span>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Profile Complete
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Add this function to calculate profile completion
const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;

  const fields = [
    profile.username,
    profile.email,
    profile.goal,
    profile.dietaryPreference,
    profile.caloricGoal,
  ];

  const filledFields = fields.filter(
    (field) => field !== null && field !== undefined && field !== ""
  ).length;
  return Math.round((filledFields / fields.length) * 100);
};

export default function UserDashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;

        const response = await fetch(`${API_BASE_URL}Users/profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify(userId),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdate = async (field, value) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;

      const response = await fetch(`${API_BASE_URL}Users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          [field]: field === "caloricGoal" ? parseInt(value) : value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setUserProfile((prev) => ({ ...prev, [field]: value }));
      toast.success(`${field} updated successfully!`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-emerald-400 to-cyan-500">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 
        dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 
              shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-12">
              <div className="relative flex items-center md:w-2/3">
                <div
                  className="relative flex flex-col md:flex-row items-center bg-white/30 dark:bg-gray-800/30 
                  backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 w-full"
                >
                  {/* Avatar Section */}
                  <div className="relative group">
                    {/* Animated Rings */}
                    <div
                      className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full 
                      opacity-70 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-300"
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 
                      rounded-full animate-spin-slow opacity-70 group-hover:opacity-100"
                    ></div>

                    {/* Profile Picture */}
                    <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-r from-emerald-500 to-cyan-500">
                      <div
                        className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 
                        flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105"
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          }}
                          className="text-3xl font-bold bg-gradient-to-br from-emerald-600 to-cyan-500 bg-clip-text text-transparent"
                        >
                          {userProfile?.username?.[0].toUpperCase() || "?"}
                        </motion.span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute bottom-1 right-1 w-4 h-4">
                      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                      <span className="absolute inset-0 rounded-full bg-emerald-500"></span>
                    </div>
                  </div>

                  {/* User Info Section */}
                  <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-1 group"
                      >
                        <h1
                          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-500 
                          bg-clip-text text-transparent group-hover:from-cyan-500 group-hover:to-emerald-600 
                          transition-all duration-300"
                        >
                          {userProfile?.username || "User"}
                        </h1>
                        <div
                          className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-emerald-500 to-cyan-500 
                          transition-all duration-300"
                        ></div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col space-y-1"
                      >
                        {/* Email with hover effect */}
                        <div className="flex items-center justify-center md:justify-start group">
                          <div
                            className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 
                            group-hover:from-emerald-500/20 group-hover:to-cyan-500/20 transition-all duration-300"
                          >
                            <svg
                              className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <span
                            className="ml-2 text-gray-600 dark:text-gray-300 group-hover:text-emerald-500 
                            dark:group-hover:text-emerald-400 transition-colors duration-300"
                          >
                            {userProfile?.email || "email@example.com"}
                          </span>
                        </div>

                        {/* Member Status Badge */}
                        <div className="flex items-center justify-center md:justify-start">
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                            bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-600 dark:text-emerald-400
                            border border-emerald-500/20"
                          >
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Active Member
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-0 md:ml-6 flex justify-end md:w-1/3">
                <ProgressRing
                  progress={calculateProfileCompletion(userProfile)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Fitness Goal"
                value={userProfile?.goal}
                icon={
                  <svg
                    className="h-6 w-6 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                }
                onUpdate={(value) => handleUpdate("goal", value)}
              />
              <StatCard
                title="Dietary Preference"
                value={userProfile?.dietaryPreference}
                icon={
                  <svg
                    className="h-6 w-6 text-cyan-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                }
                onUpdate={(value) => handleUpdate("dietaryPreference", value)}
              />
              <StatCard
                title="Daily Caloric Goal"
                value={userProfile?.caloricGoal}
                icon={
                  <svg
                    className="h-6 w-6 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
                onUpdate={(value) => handleUpdate("caloricGoal", value)}
              />
            </div>

            <motion.div
              className="mt-12 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 
                dark:from-emerald-500/10 dark:to-cyan-500/10 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white/50 dark:bg-gray-800/50 
                      rounded-lg p-4 border border-gray-100 dark:border-gray-700"
                  >
                    <div
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 
                      flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold mr-4"
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Activity {index + 1}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Description of activity {index + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
