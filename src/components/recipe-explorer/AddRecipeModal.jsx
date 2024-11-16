import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../../config/api";

const AddRecipeModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [{ name: "", quantity: "" }],
    instructions: [""],
    calories: "",
    protein: "",
    carbohydrates: "",
    fats: "",
    dietaryLabels: "",
    category: "",
    difficulty: "",
    prepTime: "",
    cookingTime: "",
    totalTime: "",
  });

  const handleAddIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "" }],
    }));
  };

  const handleAddInstruction = () => {
    setRecipe((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);

      const formattedIngredients = recipe.ingredients.map(
        (ing) => `${ing.quantity} ${ing.name}`
      );

      const recipeData = {
        name: recipe.name,
        description: recipe.description,
        ingredients: formattedIngredients,
        instructions: recipe.instructions.join("\n"),
        calories: parseInt(recipe.calories),
        protein: parseInt(recipe.protein),
        carbohydrates: parseInt(recipe.carbohydrates),
        fats: parseInt(recipe.fats),
        dietaryLabels: recipe.dietaryLabels,
        category: recipe.category,
        difficulty: recipe.difficulty,
        prepTime: parseInt(recipe.prepTime),
        cookingTime: parseInt(recipe.cookingTime),
        totalTime: parseInt(recipe.prepTime) + parseInt(recipe.cookingTime),
        createdBy: decodedToken.sub,
      };

      const response = await fetch(`${API_BASE_URL}Recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || "Failed to create recipe");
      }

      toast.success("Recipe created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast.error(error.message);
    }
  };

  const steps = [
    {
      title: "Basic Information",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Recipe Name
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Enter recipe name"
                value={recipe.name}
                onChange={(e) =>
                  setRecipe((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full p-3 rounded-xl border-2 border-gray-200 
                  dark:border-gray-700/50 
                  bg-white/50 dark:bg-gray-800/50 
                  backdrop-blur-sm
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:border-emerald-500 dark:focus:border-emerald-400
                  hover:border-emerald-400 dark:hover:border-emerald-500/50
                  transition-all duration-200 outline-none"
              />
              <div
                className="absolute inset-0 rounded-xl bg-gradient-to-r 
                from-emerald-500/0 to-cyan-500/0 opacity-0 
                group-hover:opacity-10 dark:group-hover:opacity-20 
                transition-opacity pointer-events-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <div className="relative group">
              <textarea
                placeholder="Describe your recipe..."
                rows={4}
                value={recipe.description}
                onChange={(e) =>
                  setRecipe((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-xl border-2 border-gray-200 
                  dark:border-gray-700/50 
                  bg-white/50 dark:bg-gray-800/50 
                  backdrop-blur-sm
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:border-emerald-500 dark:focus:border-emerald-400
                  hover:border-emerald-400 dark:hover:border-emerald-500/50
                  transition-all duration-200 outline-none
                  resize-none"
              />
              <div
                className="absolute inset-0 rounded-xl bg-gradient-to-r 
                from-emerald-500/0 to-cyan-500/0 opacity-0 
                group-hover:opacity-10 dark:group-hover:opacity-20 
                transition-opacity pointer-events-none"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Ingredients",
      content: (
        <div className="space-y-4">
          {recipe.ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 items-start group">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Ingredient name (e.g., Tomatoes)"
                  value={ing.name}
                  onChange={(e) => {
                    const newIngredients = [...recipe.ingredients];
                    newIngredients[idx].name = e.target.value;
                    setRecipe((prev) => ({
                      ...prev,
                      ingredients: newIngredients,
                    }));
                  }}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 
                    dark:border-gray-700/50 
                    bg-white/50 dark:bg-gray-800/50 
                    backdrop-blur-sm
                    text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:border-emerald-500 dark:focus:border-emerald-400
                    hover:border-emerald-400 dark:hover:border-emerald-500/50
                    transition-all duration-200 outline-none"
                />
                <input
                  type="text"
                  placeholder="Quantity (e.g., 500g, 2 pieces, 1 clove)"
                  value={ing.quantity}
                  onChange={(e) => {
                    const newIngredients = [...recipe.ingredients];
                    newIngredients[idx].quantity = e.target.value;
                    setRecipe((prev) => ({
                      ...prev,
                      ingredients: newIngredients,
                    }));
                  }}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 
                    dark:border-gray-700/50 
                    bg-white/50 dark:bg-gray-800/50 
                    backdrop-blur-sm
                    text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:border-emerald-500 dark:focus:border-emerald-400
                    hover:border-emerald-400 dark:hover:border-emerald-500/50
                    transition-all duration-200 outline-none"
                />
              </div>
              {recipe.ingredients.length > 1 && (
                <button
                  onClick={() => {
                    const newIngredients = recipe.ingredients.filter(
                      (_, i) => i !== idx
                    );
                    setRecipe((prev) => ({
                      ...prev,
                      ingredients: newIngredients,
                    }));
                  }}
                  className="mt-2 p-2 rounded-lg text-red-500 hover:bg-red-50 
                    dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddIngredient}
            className="w-full p-3 rounded-xl border-2 border-dashed 
              border-emerald-500 dark:border-emerald-400
              text-emerald-600 dark:text-emerald-400 
              hover:bg-emerald-50 dark:hover:bg-emerald-900/20
              transition-all duration-200"
          >
            + Add Ingredient
          </button>
        </div>
      ),
    },
    {
      title: "Instructions",
      content: (
        <div className="space-y-4">
          {recipe.instructions.map((instruction, idx) => (
            <div key={idx} className="flex gap-2">
              <div
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center 
                  bg-emerald-100 dark:bg-emerald-900 rounded-full 
                  text-emerald-600 dark:text-emerald-400"
              >
                {idx + 1}
              </div>
              <input
                type="text"
                placeholder={`Step ${idx + 1}`}
                value={instruction}
                onChange={(e) => {
                  const newInstructions = [...recipe.instructions];
                  newInstructions[idx] = e.target.value;
                  setRecipe((prev) => ({
                    ...prev,
                    instructions: newInstructions,
                  }));
                }}
                className="flex-1 p-3 rounded-xl border-2 border-gray-200 
                  dark:border-gray-700/50 
                  bg-white/50 dark:bg-gray-800/50 
                  backdrop-blur-sm
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:border-emerald-500 dark:focus:border-emerald-400
                  hover:border-emerald-400 dark:hover:border-emerald-500/50
                  transition-all duration-200 outline-none"
              />
            </div>
          ))}
          <button
            onClick={handleAddInstruction}
            className="w-full p-3 rounded-xl border-2 border-dashed 
              border-emerald-500 dark:border-emerald-400
              text-emerald-600 dark:text-emerald-400 
              hover:bg-emerald-50 dark:hover:bg-emerald-900/20
              transition-all duration-200"
          >
            + Add Step
          </button>
        </div>
      ),
    },
    {
      title: "Nutrition & Labels",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Calories
              </label>
              <input
                type="number"
                placeholder="kcal"
                value={recipe.calories}
                onChange={(e) =>
                  setRecipe((prev) => ({ ...prev, calories: e.target.value }))
                }
                className="w-full p-3 rounded-xl border-2 border-gray-200 
                  dark:border-gray-700/50 
                  bg-white/50 dark:bg-gray-800/50 
                  backdrop-blur-sm
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:border-emerald-500 dark:focus:border-emerald-400
                  hover:border-emerald-400 dark:hover:border-emerald-500/50
                  transition-all duration-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Protein
              </label>
              <input
                type="number"
                placeholder="g"
                value={recipe.protein}
                onChange={(e) =>
                  setRecipe((prev) => ({ ...prev, protein: e.target.value }))
                }
                className="w-full p-3 rounded-xl border-2 border-gray-200 
                  dark:border-gray-700/50 
                  bg-white/50 dark:bg-gray-800/50 
                  backdrop-blur-sm
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:border-emerald-500 dark:focus:border-emerald-400
                  hover:border-emerald-400 dark:hover:border-emerald-500/50
                  transition-all duration-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Carbohydrates
              </label>
              <input
                type="number"
                placeholder="g"
                value={recipe.carbohydrates}
                onChange={(e) =>
                  setRecipe((prev) => ({
                    ...prev,
                    carbohydrates: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-xl border-2 border-gray-200 
                  dark:border-gray-700/50 
                  bg-white/50 dark:bg-gray-800/50 
                  backdrop-blur-sm
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:border-emerald-500 dark:focus:border-emerald-400
                  hover:border-emerald-400 dark:hover:border-emerald-500/50
                  transition-all duration-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fats
              </label>
              <input
                type="number"
                placeholder="g"
                value={recipe.fats}
                onChange={(e) =>
                  setRecipe((prev) => ({ ...prev, fats: e.target.value }))
                }
                className="w-full p-3 rounded-xl border-2 border-gray-200 
                  dark:border-gray-700/50 
                  bg-white/50 dark:bg-gray-800/50 
                  backdrop-blur-sm
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:border-emerald-500 dark:focus:border-emerald-400
                  hover:border-emerald-400 dark:hover:border-emerald-500/50
                  transition-all duration-200 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dietary Labels
            </label>
            <select
              value={recipe.dietaryLabels}
              onChange={(e) =>
                setRecipe((prev) => ({
                  ...prev,
                  dietaryLabels: e.target.value,
                }))
              }
              className="w-full p-3 rounded-xl border-2 border-gray-200 
                dark:border-gray-700/50 
                bg-white/50 dark:bg-gray-800/50 
                backdrop-blur-sm
                text-gray-900 dark:text-white
                focus:border-emerald-500 dark:focus:border-emerald-400
                hover:border-emerald-400 dark:hover:border-emerald-500/50
                transition-all duration-200 outline-none"
            >
              <option value="">Select Label</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      title: "Additional Details",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g., Dessert, Main Course"
              value={recipe.category}
              onChange={(e) =>
                setRecipe((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full p-3 rounded-xl border-2 border-gray-200 
                dark:border-gray-700/50 
                bg-white/50 dark:bg-gray-800/50 
                backdrop-blur-sm
                text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                focus:border-emerald-500 dark:focus:border-emerald-400
                hover:border-emerald-400 dark:hover:border-emerald-500/50
                transition-all duration-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty
            </label>
            <select
              value={recipe.difficulty}
              onChange={(e) =>
                setRecipe((prev) => ({ ...prev, difficulty: e.target.value }))
              }
              className="w-full p-3 rounded-xl border-2 border-gray-200 
                dark:border-gray-700/50 
                bg-white/50 dark:bg-gray-800/50 
                backdrop-blur-sm
                text-gray-900 dark:text-white
                focus:border-emerald-500 dark:focus:border-emerald-400
                hover:border-emerald-400 dark:hover:border-emerald-500/50
                transition-all duration-200 outline-none"
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prep Time (mins)
              </label>
              <input
                type="number"
                placeholder="e.g., 15"
                value={recipe.prepTime}
                onChange={(e) =>
                  setRecipe((prev) => ({ ...prev, prepTime: e.target.value }))
                }
                className="w-full p-3 rounded-xl border-2 border-gray-200 
                  dark:border-gray-700/50 
                  bg-white/50 dark:bg-gray-800/50 
                  backdrop-blur-sm
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:border-emerald-500 dark:focus:border-emerald-400
                  hover:border-emerald-400 dark:hover:border-emerald-500/50
                  transition-all duration-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cooking Time (mins)
              </label>
              <input
                type="number"
                placeholder="e.g., 30"
                value={recipe.cookingTime}
                onChange={(e) =>
                  setRecipe((prev) => ({
                    ...prev,
                    cookingTime: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-xl border-2 border-gray-200 
                  dark:border-gray-700/50 
                  bg-white/50 dark:bg-gray-800/50 
                  backdrop-blur-sm
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  focus:border-emerald-500 dark:focus:border-emerald-400
                  hover:border-emerald-400 dark:hover:border-emerald-500/50
                  transition-all duration-200 outline-none"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm 
            flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md
              shadow-xl shadow-black/10 dark:shadow-black/30
              border border-gray-200 dark:border-gray-700/50
              relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full 
              bg-gradient-to-br from-emerald-500 to-cyan-500 blur-3xl opacity-10"
            />
            <div
              className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full 
              bg-gradient-to-br from-emerald-500 to-cyan-500 blur-3xl opacity-10"
            />

            <div className="relative">
              <div className="flex justify-between items-center mb-6">
                <h2
                  className="text-2xl font-semibold bg-gradient-to-r 
                  from-emerald-600 to-cyan-600 
                  dark:from-emerald-400 dark:to-cyan-400 
                  bg-clip-text text-transparent"
                >
                  {steps[step - 1].title}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 
                    dark:text-gray-400 dark:hover:text-gray-200
                    transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">{steps[step - 1].content}</div>

              <div className="mt-6 flex justify-between gap-4">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 rounded-xl
                      bg-gray-100 dark:bg-gray-700/50
                      hover:bg-gray-200 dark:hover:bg-gray-700
                      text-gray-700 dark:text-gray-300
                      transition-all duration-200"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={() =>
                    step < steps.length ? setStep(step + 1) : handleSubmit()
                  }
                  className="px-4 py-2 rounded-xl flex-1 ml-auto
                    bg-gradient-to-r from-emerald-500 to-cyan-500
                    hover:from-emerald-600 hover:to-cyan-600
                    text-white font-medium
                    transition-all duration-200"
                >
                  {step < steps.length ? "Next" : "Create Recipe"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddRecipeModal;
