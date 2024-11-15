import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function WeeklyPlanGrid({ weekPlan }) {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        <div className="grid grid-cols-8 gap-4">
          {/* Time slots column */}
          <div className="space-y-4">
            <div className="h-12"></div>
            {mealTypes.map((mealType) => (
              <div
                key={mealType}
                className="h-32 flex items-center justify-end pr-4"
              >
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {mealType}
                </span>
              </div>
            ))}
          </div>

          {/* Days columns */}
          {daysOfWeek.map((day) => (
            <div key={day} className="space-y-4">
              <div className="h-12 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {day}
                </span>
              </div>
              {mealTypes.map((mealType) => (
                <motion.div
                  key={`${day}-${mealType}`}
                  whileHover={{ scale: 1.02 }}
                  className="h-32 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm
                    border border-gray-100 dark:border-gray-700
                    hover:shadow-md transition-shadow"
                >
                  {weekPlan?.[day]?.[mealType] ? (
                    <div className="h-full flex flex-col justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {weekPlan[day][mealType].name}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {weekPlan[day][mealType].calories} kcal
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-sm text-gray-400 dark:text-gray-600">
                        No meal planned
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

WeeklyPlanGrid.propTypes = {
  weekPlan: PropTypes.objectOf(
    PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        calories: PropTypes.number.isRequired,
      })
    )
  ),
};

WeeklyPlanGrid.defaultProps = {
  weekPlan: {},
};
