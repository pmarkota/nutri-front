import { motion } from "framer-motion";
import PropTypes from "prop-types";

const FilterSection = ({ filters, setFilters, onSearch }) => {
  const handleNumberChange = (field) => (e) => {
    const inputValue = e.target.value;
    const value = inputValue === "" ? "" : parseInt(inputValue, 10);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl 
        bg-gradient-to-br from-emerald-50/90 to-cyan-50/90 
        dark:from-gray-800/90 dark:to-gray-900/90 
        backdrop-blur-xl shadow-2xl
        border border-white/20 dark:border-gray-700/20"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 blur-3xl opacity-20"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 blur-3xl opacity-20"></div>

      <div className="relative p-8">
        <h2
          className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 
          dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-6"
        >
          Customize Your Recipe Search
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dietary Preference Filter */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dietary Preference
            </label>
            <select
              value={filters.dietaryPreference}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  dietaryPreference: e.target.value,
                }))
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-transparent
                bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm
                text-gray-900 dark:text-white
                focus:border-emerald-500 dark:focus:border-emerald-400
                transition-all duration-200 outline-none
                group-hover:border-emerald-300 dark:group-hover:border-emerald-600"
            >
              <option value="">All Diets</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>

          {/* Numeric inputs */}
          {[
            { label: "Max Calories", key: "maxCalories", placeholder: "3000" },
            { label: "Min Protein (g)", key: "minProtein", placeholder: "1" },
            {
              label: "Max Carbs (g)",
              key: "maxCarbohydrates",
              placeholder: "500",
            },
            { label: "Max Fats (g)", key: "maxFats", placeholder: "500" },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="relative group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder={placeholder}
                  value={filters[key] === "" ? "" : filters[key]}
                  onChange={handleNumberChange(key)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent
                    bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm
                    text-gray-900 dark:text-white
                    focus:border-emerald-500 dark:focus:border-emerald-400
                    transition-all duration-200 outline-none
                    group-hover:border-emerald-300 dark:group-hover:border-emerald-600
                    placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Search Button */}
        <motion.button
          onClick={onSearch}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 w-full py-4 rounded-xl 
            text-white font-semibold text-lg
            transition-all duration-200
            flex items-center justify-center gap-2
            group relative overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 
            group-hover:from-emerald-600 group-hover:to-cyan-600"
          ></div>
          <div className="relative flex items-center justify-center gap-2">
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🔍
            </motion.span>
            <span>Search Recipes</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

FilterSection.propTypes = {
  filters: PropTypes.shape({
    dietaryPreference: PropTypes.string.isRequired,
    maxCalories: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    minProtein: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    maxCarbohydrates: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    maxFats: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default FilterSection;
