import { motion } from "framer-motion";
import PropTypes from "prop-types";
import RecipeCard from "./RecipeCard";

const RecipeGrid = ({ recipes, favoriteRecipes }) => {
  if (recipes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-full flex flex-col items-center justify-center py-16 px-4"
      >
        {/* Empty State Illustration */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="relative w-24 h-24 mb-6"
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="text-6xl">🍽️</span>
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(16, 185, 129, 0)",
                "0 0 0 20px rgba(16, 185, 129, 0.1)",
                "0 0 0 0 rgba(16, 185, 129, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Message */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
          No Recipes Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
          We couldn't find any recipes matching your current filters. Try
          adjusting your search criteria or explore our full recipe collection.
        </p>

        {/* Suggestions */}
        <div className="flex flex-wrap justify-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full text-sm
              bg-gradient-to-r from-emerald-500/10 to-cyan-500/10
              text-emerald-700 dark:text-emerald-400
              border border-emerald-500/20"
          >
            Try different ingredients
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full text-sm
              bg-gradient-to-r from-emerald-500/10 to-cyan-500/10
              text-emerald-700 dark:text-emerald-400
              border border-emerald-500/20"
          >
            Adjust nutritional filters
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full text-sm
              bg-gradient-to-r from-emerald-500/10 to-cyan-500/10
              text-emerald-700 dark:text-emerald-400
              border border-emerald-500/20"
          >
            Browse all categories
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favoriteRecipes.has(recipe.id)}
        />
      ))}
    </motion.div>
  );
};

RecipeGrid.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      // ... other recipe props
    })
  ).isRequired,
  favoriteRecipes: PropTypes.instanceOf(Set).isRequired,
};

export default RecipeGrid;
