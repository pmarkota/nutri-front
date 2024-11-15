import RecipeCardSkeleton from "./RecipeCardSkeleton";

const LoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default LoadingGrid;
