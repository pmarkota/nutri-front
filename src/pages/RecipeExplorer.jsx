import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config/api";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import PageTransition from "../components/PageTransition";
import FilterSection from "../components/recipe-explorer/FilterSection";
import RecipeGrid from "../components/recipe-explorer/RecipeGrid";
import LoadingAnimation from "../components/recipe-explorer/LoadingAnimation";
import FloatingElements from "../components/recipe-explorer/FloatingElements";

export default function RecipeExplorer() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dietaryPreference: "",
    maxCalories: "",
    minProtein: "",
    maxCarbohydrates: "",
    maxFats: "",
    nameSearchTerm: "",
  });
  const [favoriteRecipes, setFavoriteRecipes] = useState(new Set());

  // Fetch recipes function
  const fetchRecipes = async (currentFilters) => {
    try {
      setLoading(true);
      console.log("Fetching recipes with filters:", currentFilters);

      const requestBody = {
        nameSearchTerm: currentFilters.nameSearchTerm || "",
        dietaryPreference: currentFilters.dietaryPreference || null,
        maxCalories:
          currentFilters.maxCalories === "" ? 3000 : currentFilters.maxCalories,
        minProtein:
          currentFilters.minProtein === "" ? 1 : currentFilters.minProtein,
        maxCarbohydrates:
          currentFilters.maxCarbohydrates === ""
            ? 500
            : currentFilters.maxCarbohydrates,
        maxFats: currentFilters.maxFats === "" ? 500 : currentFilters.maxFats,
      };

      console.log("Request body:", requestBody);
      console.log("Fetching from URL:", `${API_BASE_URL}Recipes/filter`);

      const response = await fetch(`${API_BASE_URL}Recipes/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch recipes: ${errorText}`);
      }

      const data = await response.json();
      console.log("Received recipes:", data);
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast.error(`Failed to load recipes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchRecipes(filters);
  }, []);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;

        const response = await fetch(
          `${API_BASE_URL}UserPreferences/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const favorites = new Set(JSON.parse(data.favoriteRecipes || "[]"));
          setFavoriteRecipes(favorites);
        }
      } catch (error) {
        console.error("Error fetching favorite recipes:", error);
      }
    };

    fetchFavoriteRecipes();
  }, []);

  return (
    <PageTransition>
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
        py-12 px-4 sm:px-6 lg:px-8
        relative overflow-hidden"
      >
        <FloatingElements />

        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h1
              className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 
              dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-4"
            >
              Recipe Explorer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover delicious recipes tailored to your dietary preferences
              and nutritional goals.
            </p>
          </div>

          <FilterSection
            filters={filters}
            setFilters={setFilters}
            onSearch={() => fetchRecipes(filters)}
          />

          {loading ? (
            <LoadingAnimation />
          ) : (
            <RecipeGrid recipes={recipes} favoriteRecipes={favoriteRecipes} />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
