import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";

// Move the routes into a separate component that will be wrapped by Router
function AppRoutes() {
  const location = useLocation();

  // Simple auth check function
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/register" />;
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  // Public Route component (accessible only when not authenticated)
  const PublicRoute = ({ children }) => {
    return !isAuthenticated() ? children : <Navigate to="/home" />;
  };

  PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Navbar />
      <main className="pt-20">
        <Toaster
          position="top-right"
          toastOptions={{
            // Add dark mode styling to toasts
            className: "dark:bg-dark-card dark:text-white",
          }}
        />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated() ? "/home" : "/register"} />
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Main App component that provides the Router context
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
