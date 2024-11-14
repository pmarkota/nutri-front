import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../config/api";
import toast from "react-hot-toast";
import PageTransition from "../components/PageTransition";
import PropTypes from "prop-types";
import CircularProgress from "../components/CircularProgress";
import NutrientDisplay from "../components/NutrientDisplay";
import { useNavigate } from "react-router-dom";
import CategoryBadge from "../components/recipe-explorer/CategoryBadge";
import DifficultyIndicator from "../components/recipe-explorer/DifficultyIndicator";
import CircularProgressCookTime from "../components/recipe-explorer/CircularProgressCookTime";
import TimeDisplay from "../components/recipe-explorer/TimeDisplay";

const inputStyles = `
  /* Remove spinner buttons for number inputs */
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
`;

const customStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.2); }
    70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }

  .recipe-card-hover {
    transition: all 0.3s ease;
  }

  .recipe-card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .floating-icon {
    animation: float 3s ease-in-out infinite;
  }

  .search-pulse {
    animation: pulse 2s infinite;
  }

  .gradient-border {
    position: relative;
    background: linear-gradient(60deg, #10B981, #0EA5E9, #10B981);
    background-size: 200% 200%;
    animation: gradientBorder 4s ease infinite;
  }

  @keyframes gradientBorder {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .glass-morphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .perspective {
    perspective: 2000px;
  }

  .preserve-3d {
    transform-style: preserve-3d;
  }

  .backface-hidden {
    backface-visibility: hidden;
  }

  .rotate-y-180 {
    transform: rotateY(180deg);
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  .shimmer {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.2) 50%,
      rgba(255,255,255,0) 100%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
  }

  .card-content-enter {
    opacity: 0;
    transform: translateY(20px);
  }

  .card-content-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease-out;
  }

  .nutrition-bar {
    position: relative;
    overflow: hidden;
  }

  .nutrition-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
    animation: shimmer 2s infinite;
  }

  .floating-elements {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .floating-element {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
    animation: float 6s infinite ease-in-out;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(10px, -10px) rotate(5deg); }
    50% { transform: translate(0, -20px) rotate(0deg); }
    75% { transform: translate(-10px, -10px) rotate(-5deg); }
  }

  /* Loading animation */
  .loading-wave {
    position: relative;
    background: linear-gradient(90deg, #10B981, #0EA5E9);
    background-size: 200% 100%;
    animation: wave 2s linear infinite;
  }

  @keyframes wave {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Card hover effects */
  .card-hover-effect {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-hover-effect:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }

  /* Nutrition bar animations */
  .nutrition-bar-fill {
    position: relative;
    overflow: hidden;
  }

  .nutrition-bar-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transform: translateX(-100%);
    animation: shimmer 2s infinite;
  }

  /* Floating labels */
  .floating-label {
    transform: translateY(0);
    transition: all 0.3s ease;
  }

  .input-focused .floating-label {
    transform: translateY(-1.5rem);
    font-size: 0.875rem;
    color: #10B981;
  }

  /* 3D Card effect */
  .card-3d {
    transform-style: preserve-3d;
    transition: transform 0.5s;
  }

  .card-3d:hover {
    transform: rotateY(10deg) rotateX(5deg);
  }

  .card-3d::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(
      135deg,
      rgba(16, 185, 129, 0.2),
      rgba(14, 165, 233, 0.2)
    );
    transform: translateZ(-1px);
    filter: blur(20px);
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.5s;
  }

  .card-3d:hover::before {
    opacity: 1;
  }
`;

const DietaryDropdown = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: "", label: "All Diets", icon: "🍽️" },
    { value: "vegetarian", label: "Vegetarian", icon: "🥗" },
    { value: "vegan", label: "Vegan", icon: "🥬" },
    { value: "keto", label: "Keto", icon: "🥑" },
    { value: "paleo", label: "Paleo", icon: "🍖" },
  ];

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption =
    options.find((opt) => opt.value === selected) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-transparent
          bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm
          text-gray-900 dark:text-white
          hover:border-emerald-300 dark:hover:border-emerald-600
          focus:border-emerald-500 dark:focus:border-emerald-400
          transition-all duration-200 outline-none
          flex items-center justify-between relative
          glass-morphism"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">{selectedOption.icon}</span>
          <span>{selectedOption.label}</span>
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 rounded-xl
              bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
              border border-emerald-100 dark:border-emerald-800
              shadow-lg shadow-emerald-500/10
              overflow-hidden"
          >
            {options.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                whileHover={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  x: 5,
                }}
                className={`w-full px-4 py-3 text-left flex items-center gap-2
                  ${
                    selected === option.value
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      : "text-gray-900 dark:text-gray-100"
                  }
                  hover:text-emerald-600 dark:hover:text-emerald-400
                  transition-all duration-150
                  relative group`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">
                  {option.icon}
                </span>
                <span>{option.label}</span>
                {selected === option.value && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 text-emerald-500"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

DietaryDropdown.propTypes = {
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const FilterSection = ({ filters, setFilters, onSearch }) => {
  const handleNumberChange = (field) => (e) => {
    const inputValue = e.target.value;
    const value = inputValue === "" ? "" : parseInt(inputValue, 10);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <style>{inputStyles}</style>
      <style>{customStyles}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-emerald-50/90 to-cyan-50/90 
          dark:from-gray-800/90 dark:to-gray-900/90 
          backdrop-blur-xl shadow-2xl
          border border-white/20 dark:border-gray-700/20"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 blur-3xl opacity-20"></div>

        <div className="relative p-8">
          <h2
            className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 
            dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-6"
          >
            Customize Your Recipe Search
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Custom Dietary Dropdown */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dietary Preference
              </label>
              <DietaryDropdown
                selected={filters.dietaryPreference}
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, dietaryPreference: value }))
                }
              />
            </div>

            {/* Numeric inputs */}
            {[
              {
                label: "Max Calories",
                key: "maxCalories",
                placeholder: "3000",
              },
              { label: "Min Protein (g)", key: "minProtein", placeholder: "1" },
              {
                label: "Max Carbs (g)",
                key: "maxCarbohydrates",
                placeholder: "500",
              },
              { label: "Max Fats (g)", key: "maxFats", placeholder: "500" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="relative group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder={placeholder}
                    value={filters[key] === "" ? "" : filters[key]}
                    onChange={handleNumberChange(key)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-transparent
                      bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm
                      text-gray-900 dark:text-white
                      focus:border-emerald-500 dark:focus:border-emerald-400
                      transition-all duration-200 outline-none
                      group-hover:border-emerald-300 dark:group-hover:border-emerald-600
                      placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r 
                    from-emerald-500/0 to-cyan-500/0 group-hover:from-emerald-500/5 
                    group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none"
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Button */}
          <motion.button
            onClick={onSearch}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 w-full py-4 rounded-xl 
              gradient-border search-pulse
              text-white font-semibold text-lg
              transition-all duration-200
              flex items-center justify-center gap-2
              group relative overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 
              group-hover:from-emerald-600 group-hover:to-cyan-600"
            ></div>
            <div className="relative flex items-center justify-center gap-2">
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="inline-flex items-center justify-center text-xl"
              >
                🔍
              </motion.span>
              <span>Search Recipes</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

FilterSection.propTypes = {
  filters: PropTypes.shape({
    dietaryPreference: PropTypes.string.isRequired,
    maxCalories: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    minProtein: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    maxCarbohydrates: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    maxFats: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

const RecipeCard = ({ recipe }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const formatTime = (minutes) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const truncateDescription = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-[400px] group preserve-3d perspective-1000 cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => navigate(`/recipes/${recipe.id}`)}
    >
      {/* Main Card */}
      <motion.div
        animate={{
          rotateX: isHovered ? 5 : 0,
          rotateY: isHovered ? -5 : 0,
          translateZ: isHovered ? "20px" : "0px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute inset-0 rounded-[2rem] overflow-hidden preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background Layers */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/50 
          dark:from-gray-800/90 dark:to-gray-800/50 backdrop-blur-xl"
        >
          {/* Animated gradient orbs */}
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
        </div>

        {/* Content Container */}
        <div className="relative h-full p-6 flex flex-col preserve-3d">
          {/* Header Section */}
          <div className="space-y-4 mb-4">
            <motion.div
              animate={{ translateZ: isHovered ? "40px" : "0px" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="space-y-2"
            >
              <h3
                className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 
                dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent"
              >
                {recipe.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                {truncateDescription(recipe.description)}
              </p>
            </motion.div>

            {/* Recipe Metadata */}
            <motion.div
              animate={{ translateZ: isHovered ? "50px" : "0px" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex flex-wrap items-center gap-3"
            >
              {recipe.category && <CategoryBadge category={recipe.category} />}
              {recipe.difficulty && (
                <DifficultyIndicator difficulty={recipe.difficulty} />
              )}
              <div
                className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700
                text-gray-600 dark:text-gray-300 text-sm flex items-center"
              >
                {formatTime(recipe.totalTime)}
              </div>
            </motion.div>
          </div>

          {/* Nutrition Section */}
          <motion.div
            animate={{ translateZ: isHovered ? "60px" : "0px" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            {[
              {
                label: "Calories",
                value: recipe.calories,
                unit: "kcal",
                icon: "🔥",
              },
              {
                label: "Protein",
                value: recipe.protein,
                unit: "g",
                icon: "💪",
              },
              {
                label: "Carbs",
                value: recipe.carbohydrates,
                unit: "g",
                icon: "🌾",
              },
              { label: "Fats", value: recipe.fats, unit: "g", icon: "🥑" },
            ].map((nutrient, index) => (
              <motion.div
                key={nutrient.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group/nutrient"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 
                  rounded-xl opacity-0 group-hover/nutrient:opacity-100 transition-opacity"
                />
                <div
                  className="relative p-4 rounded-xl border border-white/10 dark:border-gray-700/10
                  bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{nutrient.icon}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {nutrient.label}
                    </span>
                  </div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {nutrient.value || 0}
                    {nutrient.unit}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Shadow */}
      <motion.div
        animate={{
          scale: isHovered ? 1.05 : 1,
          opacity: isHovered ? 0.2 : 0.1,
        }}
        className="absolute -inset-2 bg-gradient-to-br from-emerald-500 to-cyan-500 
          rounded-[2rem] blur-2xl -z-10"
      />
    </motion.div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    dietaryLabels: PropTypes.string,
    calories: PropTypes.number,
    protein: PropTypes.number,
    carbohydrates: PropTypes.number,
    fats: PropTypes.number,
    prepTime: PropTypes.string,
    difficulty: PropTypes.string,
  }).isRequired,
};

const FloatingElements = () => (
  <div className="floating-elements">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="floating-element"
        style={{
          width: `${Math.random() * 100 + 50}px`,
          height: `${Math.random() * 100 + 50}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: `linear-gradient(45deg, 
            rgba(16, 185, 129, ${Math.random() * 0.1}), 
            rgba(14, 165, 233, ${Math.random() * 0.1}))`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

const LoadingAnimation = () => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative w-16 h-16"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-4 border-emerald-500/20 
          border-t-emerald-500"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-2 rounded-full bg-gradient-to-br 
          from-emerald-500/20 to-cyan-500/20 blur-sm"
      />
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-gray-600 dark:text-gray-400"
    >
      Finding delicious recipes...
    </motion.p>
  </div>
);

// Add this helper function at the top of the file
const getDietIcon = (dietaryPreference) => {
  switch (dietaryPreference?.toLowerCase()) {
    case "vegetarian":
      return "🥗";
    case "vegan":
      return "🥬";
    case "keto":
      return "🥑";
    case "paleo":
      return "🍖";
    default:
      return "🍽️";
  }
};

export default function RecipeExplorer() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dietaryPreference: "",
    maxCalories: "",
    minProtein: "",
    maxCarbohydrates: "",
    maxFats: "",
  });

  const fetchRecipes = async (currentFilters) => {
    try {
      setLoading(true);
      console.log("Fetching recipes with filters:", currentFilters);

      const requestBody = {
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

  // Initial fetch on component mount
  useEffect(() => {
    fetchRecipes(filters);
  }, []); // Empty dependency array means this only runs once on mount

  // Handler for search button click
  const handleSearch = () => {
    fetchRecipes(filters);
  };

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
            onSearch={handleSearch} // Pass the search handler
          />

          {loading ? (
            <LoadingAnimation />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}

              {recipes.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    No recipes found matching your criteria.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
