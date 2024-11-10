import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("token") !== null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/register");
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md shadow-sm fixed top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation Links */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              NutriApp
            </Link>
            
            {isAuthenticated && (
              <div className="hidden sm:flex items-center ml-10 space-x-1">
                {[
                  { name: 'Dashboard', path: '/home' },
                  { name: 'Meals', path: '/meals' },
                  { name: 'Progress', path: '/progress' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative group
                      ${isActivePath(item.path)
                        ? 'text-emerald-600'
                        : 'text-gray-600 hover:text-emerald-600'
                      }`}
                  >
                    {item.name}
                    {isActivePath(item.path) && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></span>
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Profile & Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3 pr-4 border-r border-gray-200">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-700">John Doe</span>
                    <span className="text-xs text-gray-500">Premium Plan</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 p-[2px]">
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-sm font-medium text-emerald-600">JD</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                    text-white bg-gradient-to-r from-emerald-500 to-cyan-500 
                    hover:opacity-90 transition-all duration-200 shadow-sm
                    hover:shadow-emerald-500/25 hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                  text-white bg-gradient-to-r from-emerald-500 to-cyan-500 
                  hover:opacity-90 transition-all duration-200 shadow-sm
                  hover:shadow-emerald-500/25 hover:shadow-lg"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
} 
