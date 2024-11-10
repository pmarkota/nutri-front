import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  // Simple auth check function
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/register" />;
  };

  // Public Route component (accessible only when not authenticated)
  const PublicRoute = ({ children }) => {
    return !isAuthenticated() ? children : <Navigate to="/home" />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-cyan-50">
        <Navbar />
        <main className="pt-20">
          <Toaster position="top-right" />
          <Routes>
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
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated() ? "/home" : "/register"} />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
