import PropTypes from "prop-types";

const CircularProgress = ({
  percentage,
  color = "emerald",
  size = 40,
  thickness = 4,
  children,
}) => {
  const radius = (size - thickness) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={thickness}
          stroke="currentColor"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`text-${color}-500 transition-all duration-300`}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

CircularProgress.propTypes = {
  percentage: PropTypes.number.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  thickness: PropTypes.number,
  children: PropTypes.node,
};

export default CircularProgress;
