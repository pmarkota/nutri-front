import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function ServingCalculator({
  servings,
  setServings,
  playClick,
}) {
  const handleServingChange = (newServings) => {
    if (newServings >= 1 && newServings <= 12) {
      setServings(newServings);
      playClick?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 
        backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Adjust Servings
        </h3>
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleServingChange(servings - 1)}
            className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900
              text-emerald-600 dark:text-emerald-400 flex items-center justify-center
              hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={servings <= 1}
          >
            -
          </motion.button>
          <div className="flex flex-col items-center">
            <span
              className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 
              dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent"
            >
              {servings}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              servings
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleServingChange(servings + 1)}
            className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900
              text-emerald-600 dark:text-emerald-400 flex items-center justify-center
              hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={servings >= 12}
          >
            +
          </motion.button>
        </div>
      </div>

      {/* Visual Indicator */}
      <div className="mt-4 relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(servings / 12) * 100}%` }}
          className="absolute h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
        />
      </div>
    </motion.div>
  );
}

ServingCalculator.propTypes = {
  servings: PropTypes.number.isRequired,
  setServings: PropTypes.func.isRequired,
  playClick: PropTypes.func,
};
