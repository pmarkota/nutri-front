import { useState } from "react";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../config/api";
import GoogleLogin from "../components/GoogleLogin";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    goal: "",
    dietaryPreference: "",
    caloricGoal: "",
  });

  const goals = ["weight loss", "muscle gain", "maintenance"];
  const dietaryPreferences = [
    "none",
    "vegetarian",
    "vegan",
    "keto",
    "gluten-free",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "caloricGoal" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}Users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          lastLogin: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast.success("Registration successful!");
        navigate("/home");
      } else {
        const error = await response.text();
        toast.error(error || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg shadow-blue-100 sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="goal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Goal
                </label>
                <select
                  id="goal"
                  name="goal"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.goal}
                  onChange={handleChange}
                >
                  <option value="">Select a goal</option>
                  {goals.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="dietaryPreference"
                  className="block text-sm font-medium text-gray-700"
                >
                  Dietary Preference
                </label>
                <select
                  id="dietaryPreference"
                  name="dietaryPreference"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.dietaryPreference}
                  onChange={handleChange}
                >
                  <option value="">Select a dietary preference</option>
                  {dietaryPreferences.map((pref) => (
                    <option key={pref} value={pref}>
                      {pref}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="caloricGoal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Daily Caloric Goal
                </label>
                <input
                  id="caloricGoal"
                  name="caloricGoal"
                  type="number"
                  required
                  min="500"
                  max="10000"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.caloricGoal}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <GoogleLogin />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;
