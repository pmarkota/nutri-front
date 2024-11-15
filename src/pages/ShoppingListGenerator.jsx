import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import PageTransition from "../components/PageTransition";

export default function ShoppingListGenerator() {
  const [shoppingList, setShoppingList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(null);

  useEffect(() => {
    setInitialLoading(false);
  }, []);

  const generateShoppingList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;

      const apiUrl = `${API_BASE_URL.replace(
        /\/+$/,
        ""
      )}/ShoppingLists/generate-from-favorites`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to generate shopping list");
      }

      const data = await response.json();
      setShoppingList(data);
      toast.success("Shopping list generated!");
    } catch (error) {
      console.error("Error generating shopping list:", error);
      toast.error(error.message || "Failed to generate shopping list");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (itemId, currentStatus) => {
    try {
      setToggleLoading(itemId);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL.replace(
          /\/+$/,
          ""
        )}/ShoppingListItems/${itemId}/toggle`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(!currentStatus),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      setShoppingList((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
        ),
      }));
    } catch (error) {
      console.error("Error toggling item:", error);
      toast.error("Failed to update item");
    } finally {
      setToggleLoading(null);
    }
  };

  return (
    <PageTransition>
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 
                rounded-full mix-blend-overlay"
              animate={{
                x: [Math.random() * 100, Math.random() * -100],
                y: [Math.random() * 100, Math.random() * -100],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="relative inline-block">
              <motion.div
                className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 
                  dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent
                  relative z-10"
                whileHover={{ scale: 1.05 }}
              >
                Shopping List
              </motion.div>
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 
                  rounded-lg blur-lg z-0"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Transform your favorite recipes into a shopping adventure
            </p>
          </motion.div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateShoppingList}
              disabled={loading || initialLoading}
              className="relative px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 
                text-white text-lg font-medium shadow-lg disabled:opacity-50 
                disabled:cursor-not-allowed overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                animate={{
                  x: ["0%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="relative flex items-center space-x-2">
                {loading || initialLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>
                      {initialLoading ? "Loading..." : "Creating Magic..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span>Generate Shopping List</span>
                    <span className="group-hover:rotate-180 transition-transform duration-300">
                      ✨
                    </span>
                  </>
                )}
              </div>
            </motion.button>
          </div>

          {/* Shopping List */}
          <AnimatePresence mode="wait">
            {initialLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-12"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
              </motion.div>
            ) : (
              shoppingList &&
              shoppingList.items &&
              shoppingList.items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative"
                >
                  {/* Glass Card Effect */}
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl" />

                  <div className="relative p-8 space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-600 dark:text-gray-400">
                          Shopping Progress
                        </span>
                        <motion.span
                          key={
                            shoppingList.items.filter((i) => i.isChecked).length
                          }
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-emerald-600 dark:text-emerald-400"
                        >
                          {shoppingList.items.filter((i) => i.isChecked).length}{" "}
                          / {shoppingList.items.length}
                        </motion.span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (shoppingList.items.filter((i) => i.isChecked)
                                .length /
                                shoppingList.items.length) *
                              100
                            }%`,
                          }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Items List */}
                    <ul className="space-y-2">
                      {shoppingList.items.map((item, index) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group"
                        >
                          <div className="relative">
                            <motion.div
                              className={`p-4 rounded-xl transition-all duration-200
                              ${
                                item.isChecked
                                  ? "bg-emerald-500/10 dark:bg-emerald-500/20"
                                  : "bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="relative w-6 h-6">
                                    <input
                                      type="checkbox"
                                      checked={item.isChecked}
                                      onChange={() =>
                                        handleToggleItem(
                                          item.id,
                                          item.isChecked
                                        )
                                      }
                                      disabled={toggleLoading === item.id}
                                      className="w-6 h-6 rounded-md border-2 border-gray-300 
                                      text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0
                                      transition-colors duration-200 cursor-pointer
                                      disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    {toggleLoading === item.id && (
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                          className="absolute animate-spin w-4 h-4 border-2 
                                        border-emerald-500 border-t-transparent rounded-full"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <span
                                    className={`font-medium transition-all duration-200
                                  ${
                                    item.isChecked
                                      ? "text-gray-400 line-through"
                                      : "text-gray-800 dark:text-gray-200"
                                  }`}
                                  >
                                    {item.ingredientName}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {item.quantity} {item.unit}
                                </span>
                              </div>
                            </motion.div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            )}

            {!initialLoading &&
              shoppingList &&
              (!shoppingList.items || shoppingList.items.length === 0) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🛒
                  </motion.div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Your shopping list is empty. Let&apos;s fill it with
                    delicious ingredients!
                  </p>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
