import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import CategoryBadge from "./CategoryBadge";
import DifficultyIndicator from "./DifficultyIndicator";

const RecipeCard = ({ recipe, isFavorite }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const formatTime = (minutes) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      className="group relative cursor-pointer"
    >
      {/* Card Container */}
      <div className="relative h-[420px] rounded-2xl overflow-hidden">
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(16,185,129,0.05) 0%, rgba(6,182,212,0.05) 100%)",
              "linear-gradient(225deg, rgba(16,185,129,0.05) 0%, rgba(6,182,212,0.05) 100%)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105"
            style={{
              backgroundImage: `url(${
                recipe.imageUrl || "/default-recipe.jpg"
              })`,
            }}
          >
            {/* Subtle zoom animation */}
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
              animate={{
                y: ["0%", "100%"],
                x: [
                  `${20 + i * 30}%`,
                  `${20 + i * 30 + (Math.random() - 0.5) * 20}%`,
                ],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 5 + i * 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2,
              }}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="relative h-full p-6 flex flex-col justify-end">
          {/* Favorite Badge */}
          {isFavorite && (
            <div className="absolute top-4 right-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white 
                  px-3 py-1 rounded-full text-sm font-medium
                  flex items-center gap-1 shadow-lg"
              >
                <motion.svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </motion.svg>
                <span>Favorite</span>
              </motion.div>
            </div>
          )}

          {/* Recipe Info */}
          <div className="space-y-4">
            {/* Title and Description */}
            <div>
              <motion.h3
                className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400
                  transition-colors duration-300"
              >
                {recipe.name}
              </motion.h3>
              <p className="text-gray-300 line-clamp-2">
                {truncateDescription(recipe.description)}
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-2">
              {recipe.category && <CategoryBadge category={recipe.category} />}
              {recipe.difficulty && (
                <DifficultyIndicator difficulty={recipe.difficulty} />
              )}
              <motion.span
                className="px-3 py-1 rounded-full bg-gray-800/80 text-gray-300 text-sm
                  border border-gray-700/50"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(16, 185, 129, 0)",
                    "0 0 0 4px rgba(16, 185, 129, 0.1)",
                    "0 0 0 0 rgba(16, 185, 129, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {formatTime(recipe.totalTime)}
              </motion.span>
            </div>

            {/* Nutrition Grid */}
            <div className="grid grid-cols-2 gap-3">
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
                  className="bg-black/30 backdrop-blur-sm rounded-lg p-2
                    border border-white/10 flex items-center gap-2
                    relative overflow-hidden group/nutrient"
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover/nutrient:opacity-100
                      transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(45deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))",
                    }}
                  />

                  <motion.span
                    className="text-lg"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    {nutrient.icon}
                  </motion.span>
                  <div className="relative">
                    <div className="text-gray-400 text-xs">
                      {nutrient.label}
                    </div>
                    <div className="text-white font-medium">
                      {nutrient.value || 0}
                      {nutrient.unit}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-cyan-600/20 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Card Border Glow */}
      <div
        className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-cyan-600 
        rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300"
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
    category: PropTypes.string,
    totalTime: PropTypes.number,
  }).isRequired,
  isFavorite: PropTypes.bool,
};

export default RecipeCard;
