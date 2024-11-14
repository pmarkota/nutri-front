import { motion } from "framer-motion";
import PropTypes from "prop-types";

const TimeDisplay = ({ prepTime, cookingTime, totalTime }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-2 px-4 py-2 rounded-xl
        bg-gradient-to-r from-white/50 to-white/30 
        dark:from-gray-800/50 dark:to-gray-800/30
        backdrop-blur-sm border border-white/10 dark:border-gray-700/10
        shadow-sm hover:shadow transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">⏱️</span>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {prepTime && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Prep: {prepTime}m
              </span>
            )}
            {cookingTime && (
              <>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Cook: {cookingTime}m
                </span>
              </>
            )}
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            Total: {totalTime}m
          </span>
        </div>
      </div>
    </motion.div>
  );
};

TimeDisplay.propTypes = {
  prepTime: PropTypes.number,
  cookingTime: PropTypes.number,
  totalTime: PropTypes.number.isRequired,
};

export default TimeDisplay;
