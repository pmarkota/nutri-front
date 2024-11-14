import { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useTimer } from "react-timer-hook";

export default function TimerComponent({ onComplete, playComplete }) {
  const [minutes, setMinutes] = useState("");
  const [isTimerSet, setIsTimerSet] = useState(false);

  const time = new Date();
  time.setSeconds(time.getSeconds() + (parseInt(minutes) || 0) * 60);

  const {
    seconds,
    minutes: mins,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: time,
    onExpire: () => {
      playComplete();
      onComplete?.();
      setIsTimerSet(false);
    },
    autoStart: false,
  });

  const handleSetTimer = () => {
    if (!minutes) return;

    const newTime = new Date();
    newTime.setSeconds(newTime.getSeconds() + parseInt(minutes) * 60);
    restart(newTime);
    setIsTimerSet(true);
    start();
  };

  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm
        border border-white/20 dark:border-gray-700/20"
    >
      {!isTimerSet ? (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Set Timer (minutes)
          </label>
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter minutes"
            min="1"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSetTimer}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500
              text-white font-medium"
          >
            Start Timer
          </motion.button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {formatTime(mins)}:{formatTime(seconds)}
          </div>
          <div className="flex justify-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={isRunning ? pause : resume}
              className="px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900
                text-emerald-600 dark:text-emerald-400 font-medium"
            >
              {isRunning ? "Pause" : "Resume"}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTimerSet(false)}
              className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900
                text-red-600 dark:text-red-400 font-medium"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

TimerComponent.propTypes = {
  onComplete: PropTypes.func,
  playComplete: PropTypes.func.isRequired,
};
