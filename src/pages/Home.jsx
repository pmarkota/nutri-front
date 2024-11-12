import PageTransition from "../components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to NutriApp
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Track your nutrition journey
            </p>
          </div>

          {/* Cards */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 

              hover:shadow-xl transition-shadow duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Progress
              </h2>

              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Track your nutrition goals
              </p>
            </div>

            {/* Add more cards as needed */}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
