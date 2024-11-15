import { motion } from "framer-motion";

const RecipeCardSkeleton = () => {
  return (
    <div className="relative h-[420px] rounded-2xl overflow-hidden">
      {/* Background Shimmer Effect */}
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800">
        <motion.div
          className="absolute inset-0 -translate-x-full"
          animate={{
            translateX: ["0%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* Content Skeleton */}
      <div className="relative h-full p-6 flex flex-col justify-end">
        {/* Title and Description */}
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>

        {/* Nutrition Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-20 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
