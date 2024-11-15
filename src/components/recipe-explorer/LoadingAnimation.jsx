import { motion } from "framer-motion";

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

export default LoadingAnimation;
