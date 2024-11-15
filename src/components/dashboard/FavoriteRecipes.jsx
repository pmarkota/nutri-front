import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../../config/api";
import { jwtDecode } from "jwt-decode";
import FavoriteRecipeCard from "./FavoriteRecipeCard";
import toast from "react-hot-toast";

const FavoriteRecipes = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedView, setExpandedView] = useState(false);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;

        // First, get user preferences to get favorite recipe IDs
        const prefsResponse = await fetch(
          `${API_BASE_URL}UserPreferences/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!prefsResponse.ok) throw new Error("Failed to fetch preferences");

        const prefsData = await prefsResponse.json();
        const favoriteIds = JSON.parse(prefsData.favoriteRecipes || "[]");

        if (favoriteIds.length === 0) {
          setFavoriteRecipes([]);
          setLoading(false);
          return;
        }

        // Then fetch details for each favorite recipe individually
        const recipesPromises = favoriteIds.map((id) =>
          fetch(`${API_BASE_URL}Recipes/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json())
        );

        const recipes = await Promise.all(recipesPromises);
        setFavoriteRecipes(recipes);
      } catch (error) {
        console.error("Error fetching favorite recipes:", error);
        toast.error("Failed to load favorite recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteRecipes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 backdrop-blur-sm
        border border-white/20 dark:border-gray-700/20"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 
            dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent"
          >
            Favorite Recipes
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {favoriteRecipes.length}{" "}
            {favoriteRecipes.length === 1 ? "recipe" : "recipes"} saved
          </p>
        </div>
        {favoriteRecipes.length > 3 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpandedView(!expandedView)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10
              hover:from-emerald-500/20 hover:to-cyan-500/20 text-emerald-600 dark:text-emerald-400
              transition-all duration-200"
          >
            {expandedView ? "Show Less" : "Show All"}
          </motion.button>
        )}
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No favorite recipes yet. Start exploring and save your favorites!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/recipes")}
            className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r 
              from-emerald-500 to-cyan-500 text-white
              hover:from-emerald-600 hover:to-cyan-600
              transition-all duration-200"
          >
            Explore Recipes
          </motion.button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {favoriteRecipes
              .slice(0, expandedView ? undefined : 3)
              .map((recipe) => (
                <FavoriteRecipeCard key={recipe.id} recipe={recipe} />
              ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FavoriteRecipes;
