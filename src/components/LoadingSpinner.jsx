const LoadingSpinner = () => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
      bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-50"
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-emerald-200 dark:border-emerald-900 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
