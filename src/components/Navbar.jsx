import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setActiveLink(window.location.pathname);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
    localStorage.setItem("theme", isDark ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setActiveLink(to)}
      className="relative group px-4 py-2"
    >
      <span
        className={`relative z-10 text-gray-700 dark:text-gray-300 group-hover:text-emerald-500 
        dark:group-hover:text-emerald-400 transition-colors duration-200
        ${activeLink === to ? "text-emerald-500 dark:text-emerald-400" : ""}`}
      >
        {children}
      </span>
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 
          dark:from-emerald-500/20 dark:to-cyan-500/20 rounded-lg z-0"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      {/* Active indicator */}
      {activeLink === to && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"
          initial={false}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-10 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 
        border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <span
                className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-500 
                bg-clip-text text-transparent hover:opacity-90 transition-opacity"
              >
                NutriApp
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            {isAuthenticated ? (
              <>
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/recipes">Recipes</NavLink>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 rounded-lg text-white 
                    bg-gradient-to-r from-emerald-500 to-cyan-500 
                    hover:from-emerald-600 hover:to-cyan-600 
                    transition-all duration-200"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="ml-4 px-4 py-2 rounded-lg text-white 
                      bg-gradient-to-r from-emerald-500 to-cyan-500 
                      hover:from-emerald-600 hover:to-cyan-600 
                      transition-all duration-200"
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}

            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 
                hover:bg-gray-200 dark:hover:bg-gray-600 
                transition-colors duration-200"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.svg
                    key="sun"
                    initial={{ rotate: -30, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 30, opacity: 0 }}
                    className="w-6 h-6 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="moon"
                    initial={{ rotate: 30, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -30, opacity: 0 }}
                    className="w-6 h-6 text-gray-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <motion.div
              animate={isMobileMenuOpen ? "open" : "closed"}
              className="w-6 h-6 flex flex-col justify-around"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 8 },
                }}
                className="w-6 h-0.5 bg-current transform origin-center transition-transform"
              />
              <motion.span
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 },
                }}
                className="w-6 h-0.5 bg-current"
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -8 },
                }}
                className="w-6 h-0.5 bg-current transform origin-center transition-transform"
              />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-3 space-y-3">
              {isAuthenticated ? (
                <>
                  <NavLink to="/home">Home</NavLink>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/recipes">Recipes</NavLink>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="w-full px-4 py-2 rounded-lg text-white 
                      bg-gradient-to-r from-emerald-500 to-cyan-500 
                      hover:from-emerald-600 hover:to-cyan-600 
                      transition-all duration-200"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <Link
                    to="/register"
                    className="block px-4 py-2 rounded-lg text-white text-center
                      bg-gradient-to-r from-emerald-500 to-cyan-500 
                      hover:from-emerald-600 hover:to-cyan-600 
                      transition-all duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
