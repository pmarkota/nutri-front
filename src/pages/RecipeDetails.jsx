import { useState, useEffect, useRef } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { API_BASE_URL } from "../config/api";

import toast from "react-hot-toast";

import PageTransition from "../components/PageTransition";

import CategoryBadge from "../components/recipe-explorer/CategoryBadge";

import DifficultyIndicator from "../components/recipe-explorer/DifficultyIndicator";

import ServingCalculator from "../components/recipe-details/ServingCalculator";

import PropTypes from "prop-types";

import { jwtDecode } from "jwt-decode";

import ReviewsList from "../components/reviews/ReviewsList";

import TextareaAutosize from "react-textarea-autosize";

import { Dialog } from "@headlessui/react";

export default function RecipeDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);

  const [loading, setLoading] = useState(true);

  const [servings, setServings] = useState(1);

  const [activeTab, setActiveTab] = useState("overview");

  const [checkedIngredients, setCheckedIngredients] = useState(new Set());

  const heroRef = useRef(null);

  const [isFavorite, setIsFavorite] = useState(false);

  const [reviews, setReviews] = useState([]);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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

        const reviewsResponse = await fetch(
          `${API_BASE_URL}Recipes/${id}/reviews`,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!reviewsResponse.ok) throw new Error("Failed to load reviews");

        const reviewsData = await reviewsResponse.json();

        setReviews(reviewsData);
      } catch (error) {
        toast.error("Failed to load recipe");

        navigate("/recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
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

          const favoriteRecipes = JSON.parse(data.favoriteRecipes || "[]");

          setIsFavorite(favoriteRecipes.includes(id));
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    if (id) {
      checkFavoriteStatus();
    }
  }, [id]);

  const parseIngredients = (ingredientsString) => {
    try {
      const ingredients = JSON.parse(ingredientsString || "[]");

      return ingredients.map((ingredient) => {
        const [quantity, ...nameParts] = ingredient.split(" ");
        return {
          quantity: quantity,
          name: nameParts.join(" "),
        };
      });
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

  const NutritionalBreakdown = ({ recipe, servings }) => {
    const calculateScaledValue = (value) => {
      return Math.round((value || 0) * servings);
    };

    const nutrients = [
      {
        name: "Calories",

        value: calculateScaledValue(recipe.calories),

        unit: "kcal",

        icon: "🔥",

        color: "emerald",
      },

      {
        name: "Protein",

        value: calculateScaledValue(recipe.protein),

        unit: "g",

        icon: "💪",

        color: "blue",
      },

      {
        name: "Carbohydrates",

        value: calculateScaledValue(recipe.carbohydrates),

        unit: "g",

        icon: "🌾",

        color: "amber",
      },

      {
        name: "Fats",

        value: calculateScaledValue(recipe.fats),

        unit: "g",

        icon: "🥑",

        color: "rose",
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 

          backdrop-blur-sm border border-white/20 dark:border-gray-700/20

          relative overflow-hidden"
      >
        {/* Background Decorative Elements */}

        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-24 -right-24 w-48 h-48 

            bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 

            rounded-full blur-3xl"
          ></div>

          <div
            className="absolute -bottom-24 -left-24 w-48 h-48 

            bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 

            rounded-full blur-3xl"
          ></div>
        </div>

        {/* Title */}

        <div className="relative mb-8">
          <h3
            className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 

            dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent"
          >
            Nutritional Breakdown
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Values per {servings} serving{servings > 1 ? "s" : ""}
          </p>
        </div>

        {/* Nutrients Grid */}

        <div className="grid grid-cols-2 gap-4">
          {nutrients.map((nutrient, index) => (
            <motion.div
              key={nutrient.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div
                className="p-6 rounded-xl bg-gradient-to-br from-white/50 to-white/30 

                dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-sm

                border border-white/10 dark:border-gray-700/10

                transition-all duration-300

                hover:shadow-lg hover:border-emerald-500/20 dark:hover:border-emerald-500/20"
              >
                {/* Hexagonal Background Pattern */}

                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 17.5c4.142 0 7.5-3.358 7.5-7.5S14.142 2.5 10 2.5 2.5 5.858 2.5 10s3.358 7.5 7.5 7.5z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,

                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>

                {/* Icon */}

                <div className="relative flex justify-center mb-3">
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],

                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,

                      repeat: Infinity,

                      repeatType: "reverse",
                    }}
                    className="text-4xl"
                  >
                    {nutrient.icon}
                  </motion.span>
                </div>

                {/* Value */}

                <div className="text-center">
                  <motion.span
                    className="text-2xl font-bold bg-gradient-to-r 

                      from-emerald-600 to-cyan-600 dark:from-emerald-400 

                      dark:to-cyan-400 bg-clip-text text-transparent"
                  >
                    {nutrient.value}
                  </motion.span>

                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                    {nutrient.unit}
                  </span>
                </div>

                {/* Label */}

                <div className="mt-2 text-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {nutrient.name}
                  </span>
                </div>

                {/* Decorative Ring */}

                <div
                  className="absolute inset-0 rounded-xl border-2 border-emerald-500/0 

                  group-hover:border-emerald-500/20 dark:group-hover:border-emerald-400/20 

                  transition-all duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Card */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 rounded-xl bg-gradient-to-br 

            from-emerald-500/5 to-cyan-500/5

            border border-emerald-500/10 dark:border-emerald-400/10"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">💡</span>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Values are calculated based on your selected serving size
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Add PropTypes

  NutritionalBreakdown.propTypes = {
    recipe: PropTypes.shape({
      calories: PropTypes.number,

      protein: PropTypes.number,

      carbohydrates: PropTypes.number,

      fats: PropTypes.number,
    }).isRequired,

    servings: PropTypes.number.isRequired,
  };

  const handleFavoriteToggle = async () => {
    try {
      const token = localStorage.getItem("token");

      const decodedToken = jwtDecode(token);

      const userId = decodedToken.sub;

      const endpoint = `${API_BASE_URL}UserPreferences/${userId}/favorite-recipes${
        isFavorite ? `/${id}` : ""
      }`;

      const response = await fetch(endpoint, {
        method: isFavorite ? "DELETE" : "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: !isFavorite ? JSON.stringify({ recipeId: id }) : undefined,
      });

      if (!response.ok) throw new Error("Failed to update favorite");

      setIsFavorite(!isFavorite);

      toast.success(
        isFavorite ? "Removed from favorites" : "Added to favorites"
      );
    } catch (error) {
      console.error("Error updating favorite:", error);

      toast.error("Failed to update favorite");
    }
  };

  // Replace the FavoriteParticles component with this new version

  const FavoriteParticles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circular burst effect */}

        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-full"
        />

        {/* Floating hearts in a circle pattern */}

        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12; // Distribute hearts in a circle

          const radius = 60; // Distance from center

          const delay = i * 0.1; // Stagger the animations

          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2"
              initial={{
                x: 0,

                y: 0,

                scale: 0,

                opacity: 0,
              }}
              animate={{
                x: radius * Math.cos(angle * (Math.PI / 180)),

                y: radius * Math.sin(angle * (Math.PI / 180)),

                scale: [0, 1, 0],

                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,

                delay: delay,

                repeat: Infinity,

                repeatDelay: 2,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 text-white"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          );
        })}

        {/* Glowing orbs */}

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-white/80"
            initial={{
              x: 0,

              y: 0,

              scale: 0,

              opacity: 0,
            }}
            animate={{
              x: Math.random() * 100 - 50,

              y: Math.random() * 100 - 50,

              scale: [0, 1.5, 0],

              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2,

              delay: i * 0.2,

              repeat: Infinity,

              repeatDelay: 1,
            }}
          />
        ))}

        {/* Sparkle trails */}

        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute left-1/2 top-1/2 w-0.5 h-0.5 bg-white rounded-full"
            initial={{
              x: 0,

              y: 0,

              opacity: 0,
            }}
            animate={{
              x: (Math.random() - 0.5) * 100,

              y: (Math.random() - 0.5) * 100,

              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1,

              delay: i * 0.05,

              repeat: Infinity,

              repeatDelay: 2,
            }}
          />
        ))}
      </div>
    );
  };

  const handleSubmitReview = async (reviewData) => {
    setIsSubmittingReview(true);
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;
      const username = decodedToken.name;

      const response = await fetch(`${API_BASE_URL}Recipes/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...reviewData,
          userId: userId,
          username: username,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      const newReview = await response.json();
      setReviews((prev) => [newReview, ...prev]);
      setIsReviewModalOpen(false);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const ReviewModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ rating, comment });
    };

    // Reset form when modal closes
    useEffect(() => {
      if (!isOpen) {
        setRating(5);
        setComment("");
      }
    }, [isOpen]);

    // Focus textarea when modal opens
    useEffect(() => {
      if (isOpen && textareaRef.current) {
        setTimeout(() => {
          textareaRef.current.focus();
        }, 100);
      }
    }, [isOpen]);

    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
            <div className="p-6 space-y-6">
              <Dialog.Title
                className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 
                dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent"
              >
                Write a Review
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                    Your Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-3xl transition-all duration-200 transform hover:scale-110 
                          ${
                            star <= rating
                              ? "text-yellow-400 hover:text-yellow-500"
                              : "text-gray-300 dark:text-gray-600 hover:text-gray-400"
                          }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                    Your Review
                  </label>
                  <div className="relative">
                    <TextareaAutosize
                      ref={textareaRef}
                      value={comment}
                      onChange={(e) => setComment(e.target.value.slice(0, 500))}
                      minRows={4}
                      maxRows={8}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700
                        border-2 border-gray-200 dark:border-gray-600
                        focus:border-emerald-500 dark:focus:border-emerald-500
                        focus:ring-2 focus:ring-emerald-500/20
                        outline-none resize-none
                        text-gray-800 dark:text-gray-200
                        placeholder-gray-400 dark:placeholder-gray-500
                        transition-colors duration-200"
                      placeholder="Share your thoughts about this recipe..."
                    />
                    <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                      {comment.length}/500
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600
                      text-gray-600 dark:text-gray-400 font-medium
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r 
                      from-emerald-500 to-cyan-500 
                      text-white font-medium shadow-lg
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:from-emerald-600 hover:to-cyan-600
                      transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
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

            <div className="relative mt-8">
              <motion.button
                onClick={handleFavoriteToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`

                  relative overflow-hidden

                  px-8 py-3 rounded-xl

                  font-medium text-lg

                  transition-all duration-300 ease-in-out

                  ${
                    isFavorite
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25"
                      : "bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:text-white"
                  }

                  group

                `}
              >
                {/* Animated gradient background */}

                <div
                  className={`

                    absolute inset-0 

                    bg-gradient-to-r from-rose-500 to-pink-500

                    transition-opacity duration-300

                    ${
                      isFavorite
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }

                  `}
                />

                {/* Particles */}

                {isFavorite && <FavoriteParticles />}

                {/* Button content */}

                <div className="relative flex items-center gap-2">
                  <motion.svg
                    viewBox="0 0 24 24"
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                    animate={{
                      scale: isFavorite ? [1, 1.2, 1] : 1,

                      rotate: isFavorite ? [0, -10, 10, 0] : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </motion.svg>

                  <span className="relative">
                    {isFavorite ? "Saved to Favorites" : "Save Recipe"}
                  </span>
                </div>
              </motion.button>
            </div>
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
                {/* Nutritional Breakdown */}

                <NutritionalBreakdown recipe={recipe} servings={servings} />

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
                  <div className="relative space-y-6">
                    {recipe.instructions.split("\n").map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 group"
                      >
                        {/* Step Number */}
                        <div
                          className="flex-shrink-0 w-10 h-10 flex items-center justify-center 
                          bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 
                          dark:from-emerald-500/20 dark:to-cyan-500/20 
                          rounded-full text-emerald-600 dark:text-emerald-400 
                          font-semibold text-lg"
                        >
                          {index + 1}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1">
                          <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
                            {step}
                          </p>
                        </div>
                      </motion.div>
                    ))}
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

        {/* Reviews Section */}

        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2
                className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 

                dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent"
              >
                Reviews
              </h2>

              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full text-sm

                bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 

                dark:from-emerald-500/20 dark:to-cyan-500/20"
              >
                <span className="text-emerald-700 dark:text-emerald-400">
                  {reviews.length}
                </span>

                <span className="text-gray-600 dark:text-gray-400">
                  {reviews.length === 1 ? "Review" : "Reviews"}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500

                text-white font-medium shadow-lg"
            >
              Write a Review
            </motion.button>
          </div>

          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            onSubmit={handleSubmitReview}
            isSubmitting={isSubmittingReview}
          />

          <ReviewsList reviews={reviews} />
        </div>
      </div>
    </PageTransition>
  );
}
