import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import WeeklyPlanGrid from "../components/meal-planner/WeeklyPlanGrid";
import { API_BASE_URL } from "../config/api";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

export default function MealPlanner() {
  const [weekPlan, setWeekPlan] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    durationInDays: 7,
    considerUserPreferences: true,
    specificDietaryPreference: "",
    specificCaloricGoal: "2000",
  });

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;

        const response = await fetch(
          `${API_BASE_URL}/MealPlans/${userId}/current`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 404) {
          // Handle case where user doesn't have a meal plan yet
          setWeekPlan({});
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch meal plan");

        const data = await response.json();
        setWeekPlan(data);
      } catch (error) {
        console.error("Error fetching meal plan:", error);
        toast.error("Failed to load meal plan");
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "specificCaloricGoal") {
      // Validate caloric goal
      const calories = parseInt(value);
      if (calories < 1200) {
        toast.error("Daily caloric goal must be at least 1200");
        return;
      }
      if (calories > 4000) {
        toast.error("Daily caloric goal must be less than 4000");
        return;
      }
    }

    if (name === "durationInDays") {
      const days = parseInt(value);
      if (days < 1 || days > 14) {
        toast.error("Duration must be between 1 and 14 days");
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateMealPlan = async (e) => {
    e.preventDefault();

    // Additional validation
    const calories = parseInt(formData.specificCaloricGoal);
    if (calories < 1200 || calories > 4000) {
      toast.error("Daily caloric goal must be between 1200 and 4000");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;

      const payload = {
        userId: userId,
        durationInDays: parseInt(formData.durationInDays),
        considerUserPreferences: formData.considerUserPreferences,
        specificDietaryPreference: formData.specificDietaryPreference || null,
        specificCaloricGoal: parseInt(formData.specificCaloricGoal),
      };

      toast.loading("Generating your meal plan...");

      const response = await fetch(`${API_BASE_URL}/MealPlans/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to create meal plan");
      }

      const data = await response.json();

      // Validate the response
      const dailyAvgCalories = data.totalCalories / data.dailyPlans.length;
      const targetCalories = parseInt(formData.specificCaloricGoal);
      const variance = Math.abs(dailyAvgCalories - targetCalories);

      if (variance > 200) {
        // If more than 200 calories off per day
        toast.error(`Warning: Generated plan averages ${Math.round(
          dailyAvgCalories
        )} calories per day, 
          which is ${Math.round(
            variance
          )} calories off from your goal of ${targetCalories}`);
      }

      const transformedPlan = transformMealPlanData(data);
      setWeekPlan(transformedPlan);
      toast.success("New meal plan created!");

      // Show nutritional summary
      toast.success(
        `Daily averages: ${Math.round(
          data.totalCalories / data.dailyPlans.length
        )} calories, 
        ${Math.round(data.totalProtein / data.dailyPlans.length)}g protein, 
        ${Math.round(data.totalCarbohydrates / data.dailyPlans.length)}g carbs, 
        ${Math.round(data.totalFats / data.dailyPlans.length)}g fats`
      );
    } catch (error) {
      console.error("Error creating meal plan:", error);
      toast.error(error.message || "Failed to create meal plan");
    }
  };

  const transformMealPlanData = (data) => {
    const planByDay = {};

    data.dailyPlans.forEach((dailyPlan) => {
      planByDay[dailyPlan.day] = {};
      dailyPlan.meals.forEach((meal) => {
        planByDay[dailyPlan.day][meal.mealType] = {
          name: meal.recipeName,
          calories: meal.calories,
          recipeId: meal.recipeId,
          protein: meal.protein,
          carbohydrates: meal.carbohydrates,
          fats: meal.fats,
        };
      });
    });

    return planByDay;
  };

  return (
    <PageTransition>
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 
                dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent"
            >
              Meal Planner
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-400">
              Plan your meals for the week ahead
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <>
              {Object.keys(weekPlan).length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <form
                    onSubmit={handleCreateMealPlan}
                    className="max-w-md mx-auto space-y-6"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Duration (days)
                        </label>
                        <input
                          type="number"
                          name="durationInDays"
                          value={formData.durationInDays}
                          onChange={handleInputChange}
                          min="1"
                          max="14"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                            focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700
                            dark:border-gray-600 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="considerUserPreferences"
                          checked={formData.considerUserPreferences}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500
                            border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Consider my preferences
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Dietary Preference (optional)
                        </label>
                        <select
                          name="specificDietaryPreference"
                          value={formData.specificDietaryPreference}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                            focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700
                            dark:border-gray-600 dark:text-white"
                        >
                          <option value="">None</option>
                          <option value="Vegetarian">Vegetarian</option>
                          <option value="Vegan">Vegan</option>
                          <option value="Pescatarian">Pescatarian</option>
                          <option value="Keto">Keto</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Daily Caloric Goal (1200-4000)
                        </label>
                        <input
                          type="number"
                          name="specificCaloricGoal"
                          value={formData.specificCaloricGoal}
                          onChange={handleInputChange}
                          min="1200"
                          max="4000"
                          placeholder="e.g., 2000"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                            focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700
                            dark:border-gray-600 dark:text-white"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Recommended: 2000-2500 for maintenance
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 
                        text-white hover:from-emerald-600 hover:to-cyan-600 
                        transition-all duration-200"
                    >
                      Generate Meal Plan
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <WeeklyPlanGrid weekPlan={weekPlan} />
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
