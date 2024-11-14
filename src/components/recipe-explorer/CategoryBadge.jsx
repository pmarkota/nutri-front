import { motion } from "framer-motion";
import PropTypes from "prop-types";

const CategoryBadge = ({ category }) => {
  const getCategoryConfig = (categoryName) => {
    const configs = {
      breakfast: {
        label: "Breakfast",
        gradient: "from-amber-500 to-orange-500",
        darkGradient: "dark:from-amber-600 dark:to-orange-600",
        bgLight: "bg-amber-50",
        bgDark: "dark:bg-amber-900/30",
        textLight: "text-amber-800",
        textDark: "dark:text-amber-200",
        borderLight: "border-amber-100",
        borderDark: "dark:border-amber-800",
      },
      lunch: {
        label: "Lunch",
        gradient: "from-emerald-500 to-teal-500",
        darkGradient: "dark:from-emerald-600 dark:to-teal-600",
        bgLight: "bg-emerald-50",
        bgDark: "dark:bg-emerald-900/30",
        textLight: "text-emerald-800",
        textDark: "dark:text-emerald-200",
        borderLight: "border-emerald-100",
        borderDark: "dark:border-emerald-800",
      },
      dinner: {
        label: "Dinner",
        gradient: "from-blue-500 to-indigo-500",
        darkGradient: "dark:from-blue-600 dark:to-indigo-600",
        bgLight: "bg-blue-50",
        bgDark: "dark:bg-blue-900/30",
        textLight: "text-blue-800",
        textDark: "dark:text-blue-200",
        borderLight: "border-blue-100",
        borderDark: "dark:border-blue-800",
      },
      snack: {
        label: "Snack",
        gradient: "from-purple-500 to-pink-500",
        darkGradient: "dark:from-purple-600 dark:to-pink-600",
        bgLight: "bg-purple-50",
        bgDark: "dark:bg-purple-900/30",
        textLight: "text-purple-800",
        textDark: "dark:text-purple-200",
        borderLight: "border-purple-100",
        borderDark: "dark:border-purple-800",
      },
      dessert: {
        label: "Dessert",
        gradient: "from-pink-500 to-rose-500",
        darkGradient: "dark:from-pink-600 dark:to-rose-600",
        bgLight: "bg-pink-50",
        bgDark: "dark:bg-pink-900/30",
        textLight: "text-pink-800",
        textDark: "dark:text-pink-200",
        borderLight: "border-pink-100",
        borderDark: "dark:border-pink-800",
      },
      default: {
        label: "Other",
        gradient: "from-gray-500 to-slate-500",
        darkGradient: "dark:from-gray-600 dark:to-slate-600",
        bgLight: "bg-gray-50",
        bgDark: "dark:bg-gray-900/30",
        textLight: "text-gray-800",
        textDark: "dark:text-gray-200",
        borderLight: "border-gray-100",
        borderDark: "dark:border-gray-800",
      },
    };

    const categoryLower = categoryName?.toLowerCase() || "default";
    return configs[categoryLower] || configs.default;
  };

  const config = getCategoryConfig(category);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center px-3 py-1 rounded-full
        ${config.bgLight} ${config.bgDark}
        ${config.textLight} ${config.textDark}
        border ${config.borderLight} ${config.borderDark}
        transition-all duration-200
        relative overflow-hidden
        group
      `}
    >
      {/* Gradient hover effect */}
      <div
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity
          bg-gradient-to-r ${config.gradient} ${config.darkGradient}
        `}
      />

      {/* Badge content */}
      <span className="relative text-sm font-medium">{config.label}</span>

      {/* Optional shimmer effect on hover */}
      <div
        className="
          absolute inset-0 -translate-x-full group-hover:translate-x-full
          bg-gradient-to-r from-transparent via-white/20 to-transparent
          transition-transform duration-1000
        "
      />
    </motion.div>
  );
};

CategoryBadge.propTypes = {
  category: PropTypes.string.isRequired,
};

export default CategoryBadge;
