import PropTypes from "prop-types";
import { motion } from "framer-motion";

const NutrientDisplay = ({ label, value, icon, color, isHovered }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-3 rounded-xl
        bg-gradient-to-br from-white/50 to-white/30 
        dark:from-gray-800/50 dark:to-gray-800/30
        backdrop-blur-sm border border-white/10 dark:border-gray-700/10"
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        className="flex flex-col items-center gap-1"
      >
        <span className="text-xl">{icon}</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {label}
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {value || "0"}g
        </span>
      </motion.div>
    </motion.div>
  );
};

NutrientDisplay.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  isHovered: PropTypes.bool.isRequired,
};

export default NutrientDisplay;
