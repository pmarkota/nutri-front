import { motion } from "framer-motion";
import PropTypes from "prop-types";

const CircularProgressCookTime = ({ totalTime }) => {
  // Calculate percentage for the ring (assuming max time of 180 minutes)
  const calculatePercentage = (time) => {
    const maxTime = 180; // 3 hours
    return Math.min((time / maxTime) * 100, 100);
  };

  const percentage = calculatePercentage(totalTime);
  const radius = 30;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="relative w-16 h-16"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-xl" />

      {/* SVG Ring */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="fill-none stroke-gray-200 dark:stroke-gray-700"
          strokeWidth="8"
        />

        {/* Progress Ring with Gradient */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="fill-none stroke-[url(#gradient)]"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="stop-color-emerald-500" />
            <stop offset="100%" className="stop-color-cyan-500" />
          </linearGradient>
        </defs>
      </svg>

      {/* Time Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 
          dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent"
        >
          {totalTime}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">min</span>
      </div>
    </motion.div>
  );
};

CircularProgressCookTime.propTypes = {
  totalTime: PropTypes.number.isRequired,
};

export default CircularProgressCookTime;
