import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../config/api";
import toast from "react-hot-toast";
import PageTransition from "../components/PageTransition";
import CategoryBadge from "../components/recipe-explorer/CategoryBadge";
import DifficultyIndicator from "../components/recipe-explorer/DifficultyIndicator";
import ChartComponent from "../components/recipe-details/ChartComponent";
import ServingCalculator from "../components/recipe-details/ServingCalculator";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const heroRef = useRef(null);

  const normalizeDifficulty = (difficulty) => {
    const difficultyMap = {
      easy: "easy",
      medium: "medium",
      hard: "hard",
      difficult: "hard",
    };
    return difficultyMap[difficulty?.toLowerCase()] || "medium";
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}Recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Recipe not found");
        const data = await response.json();
        setRecipe({
          ...data,
          difficulty: normalizeDifficulty(data.difficulty),
        });
      } catch (error) {
        toast.error("Failed to load recipe");
        navigate("/recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const parseIngredients = (ingredientsString) => {
    try {
      return JSON.parse(ingredientsString || "[]");
    } catch (error) {
      console.error("Error parsing ingredients:", error);
      return [];
    }
  };

  const calculateScaledQuantity = (quantity) => {
    const match = quantity.match(/(\d+(?:\.\d+)?)\s*(\w+)/);
    if (!match) return quantity;

    const [_, amount, unit] = match;
    const scaledAmount = (parseFloat(amount) * servings).toFixed(1);
    return `${scaledAmount} ${unit}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Recipe not found</div>
      </div>
    );
  }

  const ingredients = parseIngredients(recipe.ingredients);

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "ingredients", label: "Ingredients", icon: "🥗" },
    { id: "instructions", label: "Instructions", icon: "📝" },
  ];

  return (
    <PageTransition>
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        {/* Hero Section */}
        <div
          className="relative min-h-[40vh] flex items-center justify-center overflow-hidden"
          ref={heroRef}
        >
          {/* Background Effects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            {/* Gradient Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-white/90 
              dark:from-emerald-500/10 dark:to-gray-900/90"
            />

            {/* Animated Orbs */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -right-1/2 w-full h-full 
                bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 
                rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/2 -left-1/2 w-full h-full 
                bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 
                rounded-full blur-3xl"
            />
          </motion.div>

          {/* Content Container */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1
                className="text-5xl md:text-6xl font-bold mb-4 
                bg-gradient-to-r from-emerald-600 to-cyan-600 
                dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent
                leading-tight"
              >
                {recipe.name}
              </h1>
              {recipe.description && (
                <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                  {recipe.description}
                </p>
              )}
            </motion.div>

            {/* Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {recipe.category && <CategoryBadge category={recipe.category} />}
              {recipe.difficulty && (
                <DifficultyIndicator difficulty={recipe.difficulty} />
              )}
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Serving Calculator */}
          <div className="max-w-md mx-auto mb-12">
            <ServingCalculator servings={servings} setServings={setServings} />
          </div>

          {/* Tabs Navigation */}
          <div className="flex justify-center mb-12">
            <div
              className="inline-flex p-2 rounded-2xl bg-white/50 dark:bg-gray-800/50 
              backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
            >
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2
                    transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Nutritional Chart */}
                <ChartComponent recipe={recipe} servings={servings} />

                {/* Time Information */}
                <div className="space-y-4">
                  {[
                    { label: "Prep Time", value: recipe.prepTime, icon: "⏲️" },
                    {
                      label: "Cooking Time",
                      value: recipe.cookingTime,
                      icon: "🍳",
                    },
                    {
                      label: "Total Time",
                      value: recipe.totalTime,
                      icon: "⌛",
                    },
                  ].map((time) => (
                    <motion.div
                      key={time.label}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 
                        backdrop-blur-sm border border-white/20 dark:border-gray-700/20
                        flex items-center gap-4"
                    >
                      <span className="text-2xl">{time.icon}</span>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {time.label}
                        </div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {time.value} min
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "ingredients" && (
              <motion.div
                key="ingredients"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="group relative"
                    >
                      <div
                        className="relative overflow-hidden rounded-xl p-4
                          bg-white/80 dark:bg-gray-800/80 
                          backdrop-blur-sm border border-white/20 dark:border-gray-700/20
                          hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                              {ingredient.name}
                            </h3>
                            <div
                              className="mt-1 text-sm font-medium bg-gradient-to-r 
                              from-emerald-600 to-cyan-600 dark:from-emerald-400 
                              dark:to-cyan-400 bg-clip-text text-transparent"
                            >
                              {calculateScaledQuantity(ingredient.quantity)}
                            </div>
                          </div>

                          <div className="h-full w-px bg-gradient-to-b from-emerald-500/20 to-cyan-500/20" />

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCheckedIngredients((prev) => {
                                const newSet = new Set(prev);
                                if (newSet.has(index)) {
                                  newSet.delete(index);
                                } else {
                                  newSet.add(index);
                                }
                                return newSet;
                              });
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center
                              transition-colors duration-200 ${
                                checkedIngredients.has(index)
                                  ? "bg-emerald-500 text-white"
                                  : "bg-gray-200 dark:bg-gray-700"
                              }`}
                          >
                            {checkedIngredients.has(index) && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-4 h-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </motion.svg>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "instructions" && (
              <motion.div
                key="instructions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div
                  className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 
                  backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-8"
                >
                  <div className="relative">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap"
                    >
                      {recipe.instructions}
                    </motion.div>
                  </div>

                  {/* Subtle gradient decorations */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br 
                    from-emerald-500/5 to-cyan-500/5 rounded-full blur-2xl"
                  />
                  <div
                    className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br 
                    from-cyan-500/5 to-emerald-500/5 rounded-full blur-2xl"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
