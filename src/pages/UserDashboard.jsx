import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

export default function UserDashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}Users/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden"
          >
            <div className="p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="mb-4 sm:mb-0 sm:mr-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-white text-4xl font-bold">
                    {userProfile?.name
                      ? userProfile.name[0].toUpperCase()
                      : "?"}
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {userProfile?.name || "User"}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    @{userProfile?.username || "username"}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Email
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {userProfile?.email || "Not provided"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Fitness Goal
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {userProfile?.goal || "Not set"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Dietary Preference
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {userProfile?.dietaryPreference || "Not set"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Daily Caloric Goal
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {userProfile?.caloricGoal || "Not set"} calories
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition duration-300 ease-in-out transform hover:scale-105">
                  Edit Profile
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
