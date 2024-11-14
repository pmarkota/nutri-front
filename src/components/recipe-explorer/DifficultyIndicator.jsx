import { motion } from "framer-motion";
import PropTypes from "prop-types";

const DifficultyIndicator = ({ difficulty }) => {
  const getDifficultyConfig = (level) => {
    const configs = {
      easy: {
        label: "Easy",
        color: "emerald",
        bars: 1,
        gradient: "from-emerald-500 to-emerald-600",
        darkGradient: "dark:from-emerald-600 dark:to-emerald-700",
        bgLight: "bg-emerald-50",
        bgDark: "dark:bg-emerald-900/30",
        textLight: "text-emerald-700",
        textDark: "dark:text-emerald-300",
      },
      medium: {
        label: "Medium",
        color: "amber",
        bars: 2,
        gradient: "from-amber-500 to-amber-600",
        darkGradient: "dark:from-amber-600 dark:to-amber-700",
        bgLight: "bg-amber-50",
        bgDark: "dark:bg-amber-900/30",
        textLight: "text-amber-700",
        textDark: "dark:text-amber-300",
      },
      hard: {
        label: "Hard",
        color: "rose",
        bars: 3,
        gradient: "from-rose-500 to-rose-600",
        darkGradient: "dark:from-rose-600 dark:to-rose-700",
        bgLight: "bg-rose-50",
        bgDark: "dark:bg-rose-900/30",
        textLight: "text-rose-700",
        textDark: "dark:text-rose-300",
      },
    };

    return configs[level?.toLowerCase()] || configs.medium;
  };

  const config = getDifficultyConfig(difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg
        ${config.bgLight} ${config.bgDark}
        ${config.textLight} ${config.textDark}
        transition-all duration-200
      `}
    >
      {/* Difficulty Label */}
      <span className="text-sm font-medium">{config.label}</span>

      {/* Difficulty Bars */}
      <div className="flex gap-1">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: "12px" }}
            transition={{ delay: index * 0.1 }}
            className={`w-1.5 rounded-full ${
              index < config.bars
                ? `bg-gradient-to-b ${config.gradient} ${config.darkGradient}`
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

DifficultyIndicator.propTypes = {
  difficulty: PropTypes.oneOf(["easy", "medium", "hard"]).isRequired,
};

export default DifficultyIndicator;
