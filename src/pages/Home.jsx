import PageTransition from "../components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to NutriApp
            </h1>
          </div>
          {/* Add your home page content here */}
        </div>
      </div>
    </PageTransition>
  );
}














