import { motion } from "framer-motion";
import PropTypes from "prop-types";
import RecipeCard from "./RecipeCard";

const RecipeGrid = ({ recipes, favoriteRecipes }) => {
  if (recipes.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No recipes found matching your criteria.
        </p>
      </div>
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
