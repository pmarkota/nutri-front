import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

export default function ChartComponent({ recipe, servings = 1 }) {
  const nutritionCards = [
    {
      label: "Calories",
      value: recipe.calories * servings || 0,
      unit: "kcal",
      icon: "🔥",
      gradient: "from-amber-500 to-orange-500",
      delay: 0,
      description: "Total Energy",
    },
    {
      label: "Protein",
      value: recipe.protein * servings || 0,
      unit: "g",
      icon: "💪",
      gradient: "from-emerald-500 to-green-500",
      delay: 0.1,
      description: "Muscle Builder",
    },
    {
      label: "Carbs",
      value: recipe.carbohydrates * servings || 0,
      unit: "g",
      icon: "🌾",
      gradient: "from-cyan-500 to-blue-500",
      delay: 0.2,
      description: "Energy Source",
    },
    {
      label: "Fats",
      value: recipe.fats * servings || 0,
      unit: "g",
      icon: "🥑",
      gradient: "from-rose-500 to-pink-500",
      delay: 0.3,
      description: "Essential Nutrients",
    },
  ];

  return (
    <div className="relative p-8 overflow-hidden">
      {/* Animated Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/50 
        dark:from-gray-800/90 dark:to-gray-800/50 backdrop-blur-xl"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full 
            bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 
            rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full 
            bg-gradient-to-br from-rose-500/10 to-orange-500/10 
            rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative">
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 
            dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8"
        >
          Nutritional Breakdown
        </motion.h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {nutritionCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="group relative preserve-3d"
            >
              {/* Card */}
              <div
                className={`p-6 rounded-2xl bg-gradient-to-br ${card.gradient}
                shadow-lg group-hover:shadow-2xl transition-all duration-300
                border border-white/20 dark:border-gray-700/20 relative z-10`}
              >
                {/* Content */}
                <div className="relative text-white">
                  {/* Icon with Animation */}
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    className="text-3xl mb-4"
                  >
                    {card.icon}
                  </motion.div>

                  {/* Label and Value */}
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold">{card.label}</h4>
                    <p className="text-sm text-white/80">{card.description}</p>
                    <div className="flex items-baseline gap-1 mt-3">
                      <span className="text-4xl font-bold">{card.value}</span>
                      <span className="text-lg">{card.unit}</span>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-2 right-2 opacity-20">
                    <svg className="w-24 h-24" viewBox="0 0 100 100">
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="283"
                        animate={{
                          strokeDashoffset: [283, 0],
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient}
                opacity-0 group-hover:opacity-30 blur-xl rounded-2xl -z-10
                transition-opacity duration-300`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

ChartComponent.propTypes = {
  recipe: PropTypes.shape({
    calories: PropTypes.number,
    protein: PropTypes.number,
    carbohydrates: PropTypes.number,
    fats: PropTypes.number,
  }).isRequired,
  servings: PropTypes.number,
};
