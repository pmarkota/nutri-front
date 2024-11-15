import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const FavoriteRecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const truncateText = (text, maxLength) => {
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
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => navigate(`/recipes/${recipe.id}`)}
      className="group relative cursor-pointer"
    >
      {/* Main Card */}
      <div
        className="relative p-8 h-[280px] rounded-2xl bg-gradient-to-br from-white/50 to-white/30 
        dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-sm border border-white/20 
        dark:border-gray-700/20 transition-all duration-300 hover:shadow-lg
        hover:border-emerald-500/20 dark:hover:border-emerald-500/20"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"
            animate={{
              opacity: [0.1, 0.15, 0.1],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent 
            dark:from-gray-800/50 dark:to-transparent backdrop-blur-[2px]"
          />
        </div>

        {/* Content Container */}
        <div className="relative h-full flex flex-col">
          {/* Header Section - Fixed Height */}
          <div className="h-[60px] mb-6">
            <div className="flex justify-between items-start gap-4">
              <motion.h3
                layout="position"
                className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 
                  dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent
                  group-hover:from-emerald-500 group-hover:to-cyan-500 transition-all duration-300
                  line-clamp-2"
              >
                {truncateText(recipe.name, 45)}
              </motion.h3>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-sm
                  bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
                  border border-emerald-500/20 whitespace-nowrap shrink-0"
              >
                <span>⏱️</span>
                <span>{formatTime(recipe.totalTime)}</span>
              </motion.div>
            </div>
          </div>

          {/* Description - Fixed Height */}
          <div className="h-[50px] mb-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {truncateText(recipe.description, 45)}
            </p>
          </div>

          {/* Stats Grid - Fixed Height */}
          <div className="h-[80px] mb-6">
            <div className="grid grid-cols-2 gap-4">
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
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl
                    bg-gradient-to-r from-white/50 to-transparent 
                    dark:from-gray-700/50 dark:to-transparent
                    border border-white/10 dark:border-gray-700/10"
                >
                  <span className="text-xl">{stat.icon}</span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="font-medium text-gray-700 dark:text-gray-200">
                      {stat.value || 0}
                      {stat.unit}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tags Section - Fixed Height */}
          <div className="h-[32px]">
            <div className="flex flex-wrap gap-2">
              {recipe.category && (
                <span
                  className="px-3 py-1 text-xs rounded-lg bg-cyan-500/10 
                  text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                >
                  {recipe.category}
                </span>
              )}
              {recipe.difficulty && (
                <span
                  className="px-3 py-1 text-xs rounded-lg bg-rose-500/10 
                  text-rose-600 dark:text-rose-400 border border-rose-500/20"
                >
                  {recipe.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hover Effects */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
            transition-opacity duration-300 pointer-events-none"
          initial={false}
          animate={{
            background: [
              "radial-gradient(600px circle at var(--x) var(--y), rgba(16, 185, 129, 0.05), transparent 40%)",
              "radial-gradient(600px circle at var(--x) var(--y), rgba(6, 182, 212, 0.05), transparent 40%)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          style={{
            "--x": "50%",
            "--y": "50%",
          }}
        />
      </div>

      {/* Bottom Glow */}
      <motion.div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-300 -z-10 blur-sm"
        style={{
          background:
            "linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))",
        }}
      />
    </motion.div>
  );
};

FavoriteRecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    calories: PropTypes.number,
    totalTime: PropTypes.number,
    category: PropTypes.string,
    difficulty: PropTypes.string,
    protein: PropTypes.number,
  }).isRequired,
};

export default FavoriteRecipeCard;
