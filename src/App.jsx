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
import UserDashboard from "./pages/UserDashboard";
import { AuthProvider } from "./context/AuthContext";
import RecipeExplorer from "./pages/RecipeExplorer";

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
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Toaster
          position="top-right"
          toastOptions={{
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
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipes"
              element={
                <ProtectedRoute>
                  <RecipeExplorer />
                </ProtectedRoute>
              }
            />
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
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
