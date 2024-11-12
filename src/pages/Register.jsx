import { useState } from "react";

import { toast } from "react-hot-toast";

import { API_BASE_URL } from "../config/api";

import GoogleLogin from "../components/GoogleLogin";

import { useNavigate } from "react-router-dom";

import PageTransition from "../components/PageTransition";

import PropTypes from "prop-types";

import { motion, AnimatePresence } from "framer-motion";

import { Link } from "react-router-dom";

const FormInput = ({ label, icon, error, isValid, value, ...props }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
        {label}
      </label>

      <motion.div className="mt-1 relative" whileHover={{ scale: 1.01 }}>
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <motion.div
            animate={{
              rotate: value ? 360 : 0,

              scale: value ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
        </div>

        <input
          {...props}
          className={`block w-full pl-14 pr-12 py-3 text-lg rounded-xl bg-white/80 

            backdrop-blur-sm border-2 transition-all duration-300 ease-out

            ${
              error
                ? "border-red-300 shadow-lg shadow-red-100"
                : isValid && value
                ? "border-emerald-300 shadow-lg shadow-emerald-100"
                : "border-gray-200 hover:border-emerald-200 shadow-lg shadow-gray-100/50"
            }`}
        />

        {value && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none"
          >
            {isValid ? (
              <motion.svg
                className="h-6 w-6 text-emerald-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                />
              </motion.svg>
            ) : (
              <motion.svg
                className="h-6 w-6 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                />
              </motion.svg>
            )}
          </motion.div>
        )}
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string.isRequired,

  icon: PropTypes.node,

  error: PropTypes.string,

  isValid: PropTypes.bool,

  value: PropTypes.string,
};

const useDropdownManager = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownClick = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  return { openDropdown, handleDropdownClick };
};

const CustomDropdown = ({
  label,

  value,

  onChange,

  options,

  name,

  error,

  touched,

  isOpen,

  onDropdownClick,
}) => {
  return (
    <div className="relative z-20">
      <label className="block text-sm font-medium bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
        {label}
      </label>

      <motion.div className="relative mt-1" whileHover={{ scale: 1.01 }}>
        <button
          type="button"
          onClick={() => onDropdownClick(name)}
          className={`relative w-full px-6 py-3 text-left bg-white rounded-xl
            border-2 transition-all duration-300 ease-out flex items-center justify-between
            ${
              touched && error
                ? "border-red-300 shadow-lg shadow-red-100"
                : value
                ? "border-emerald-300 shadow-lg shadow-emerald-100"
                : "border-gray-200 hover:border-emerald-200 shadow-lg shadow-gray-100/50"
            }`}
        >
          <span
            className={`text-lg ${value ? "text-gray-800" : "text-gray-400"}`}
          >
            {value
              ? value.charAt(0).toUpperCase() + value.slice(1)
              : `Choose ${label.toLowerCase()}`}
          </span>

          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="flex items-center"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", bounce: 0.25 }}
              className="absolute w-full mt-2 overflow-hidden bg-white rounded-xl shadow-xl border-2 border-emerald-100"
              style={{ zIndex: 30 }}
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                className="max-h-60 overflow-auto py-2"
              >
                {options.map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    variants={{
                      hidden: { opacity: 0, x: -20 },

                      visible: { opacity: 1, x: 0 },
                    }}
                    whileHover={{
                      backgroundColor: "rgba(167, 243, 208, 0.2)",

                      x: 10,
                    }}
                    onClick={() => {
                      onChange({ target: { name, value: option } });

                      onDropdownClick(name);
                    }}
                    className={`w-full px-6 py-3 text-left text-lg transition-colors

                      ${
                        value === option
                          ? "text-emerald-600 bg-emerald-50/50"
                          : "text-gray-600 hover:text-emerald-600"
                      }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {touched && error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

CustomDropdown.propTypes = {
  label: PropTypes.string.isRequired,

  value: PropTypes.string,

  onChange: PropTypes.func.isRequired,

  options: PropTypes.arrayOf(PropTypes.string).isRequired,

  name: PropTypes.string.isRequired,

  error: PropTypes.string,

  touched: PropTypes.bool,

  isOpen: PropTypes.bool.isRequired,

  onDropdownClick: PropTypes.func.isRequired,
};

const Register = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    values: {
      username: "",

      email: "",

      password: "",

      goal: "",

      dietaryPreference: "",

      caloricGoal: "",
    },

    errors: {},

    touched: {},
  });

  const goals = ["weight loss", "muscle gain", "maintenance"];

  const dietaryPreferences = [
    "none",

    "vegetarian",

    "vegan",

    "keto",

    "gluten-free",
  ];

  const icons = {
    username: (
      <svg
        className="h-5 w-5 text-emerald-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),

    email: (
      <svg
        className="h-5 w-5 text-emerald-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),

    password: (
      <svg
        className="h-5 w-5 text-emerald-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),

    caloricGoal: (
      <svg
        className="h-5 w-5 text-emerald-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  };

  const validateField = (name, value) => {
    switch (name) {
      case "username":
        return value.trim().length > 0;

      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      case "password":
        return value.length >= 6;

      case "goal":
        return value.trim().length > 0;

      case "dietaryPreference":
        return value.trim().length > 0;

      case "caloricGoal":
        return value >= 500 && value <= 10000;

      default:
        return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const isValid = validateField(name, value);

    setFormState((prev) => ({
      ...prev,

      values: {
        ...prev.values,

        [name]: value,
      },

      touched: {
        ...prev.touched,

        [name]: true,
      },

      errors: {
        ...prev.errors,

        [name]: isValid ? "" : prev.errors[name],
      },
    }));
  };

  const validate = (values) => {
    const errors = {};

    if (!values.username.trim()) {
      errors.username = "Username is required";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!values.goal) {
      errors.goal = "Please select a goal";
    }

    if (!values.dietaryPreference) {
      errors.dietaryPreference = "Please select a dietary preference";
    }

    if (!values.caloricGoal) {
      errors.caloricGoal = "Caloric goal is required";
    } else if (values.caloricGoal < 500 || values.caloricGoal > 10000) {
      errors.caloricGoal = "Please enter a reasonable caloric goal (500-10000)";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(formState.values);

    setFormState((prev) => ({
      ...prev,

      errors,

      touched: Object.keys(prev.values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),

        {}
      ),
    }));

    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch(`${API_BASE_URL}Users/register`, {
          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({
            ...formState.values,

            lastLogin: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          toast.success("Registration successful!");

          navigate("/home");
        } else {
          const errorData = await response.text();

          toast.error(errorData || "Registration failed");
        }
      } catch {
        toast.error("Network error. Please try again later.");
      }
    }
  };

  const { openDropdown, handleDropdownClick } = useDropdownManager();

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <motion.div
          className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          }}
        >
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>

          {/* Centered text and button */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="group relative inline-flex items-center justify-center px-6 py-2 overflow-hidden rounded-lg 
              bg-gradient-to-r from-emerald-500 to-cyan-500 font-medium text-white 
              transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl active:scale-95"
            >
              {/* Spotlight effect */}
              <span
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent 
                -translate-x-[100%] group-hover:translate-x-[100%] duration-1000 ease-out"
              />

              {/* Text and icon */}
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
                <span>Sign in instead</span>
              </span>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Username"
              name="username"
              type="text"
              value={formState.values.username}
              onChange={handleChange}
              icon={icons.username}
              error={formState.touched.username && formState.errors.username}
              isValid={validateField("username", formState.values.username)}
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formState.values.email}
              onChange={handleChange}
              icon={icons.email}
              error={formState.touched.email && formState.errors.email}
              isValid={validateField("email", formState.values.email)}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formState.values.password}
              onChange={handleChange}
              icon={icons.password}
              error={formState.touched.password && formState.errors.password}
              isValid={validateField("password", formState.values.password)}
            />

            <div className="relative z-20">
              <CustomDropdown
                label="Goal"
                name="goal"
                value={formState.values.goal}
                onChange={handleChange}
                options={goals}
                error={formState.errors.goal}
                touched={formState.touched.goal}
                isOpen={openDropdown === "goal"}
                onDropdownClick={handleDropdownClick}
              />
            </div>

            <div className="relative z-10">
              <CustomDropdown
                label="Dietary Preference"
                name="dietaryPreference"
                value={formState.values.dietaryPreference}
                onChange={handleChange}
                options={dietaryPreferences}
                error={formState.errors.dietaryPreference}
                touched={formState.touched.dietaryPreference}
                isOpen={openDropdown === "dietaryPreference"}
                onDropdownClick={handleDropdownClick}
              />
            </div>

            <FormInput
              label="Daily Caloric Goal"
              name="caloricGoal"
              type="number"
              value={formState.values.caloricGoal}
              onChange={handleChange}
              icon={icons.caloricGoal}
              error={
                formState.touched.caloricGoal && formState.errors.caloricGoal
              }
              isValid={validateField(
                "caloricGoal",

                formState.values.caloricGoal
              )}
              placeholder="e.g., 2000"
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 text-lg font-medium text-white 

                bg-gradient-to-r from-emerald-500 to-cyan-500 

                rounded-xl shadow-lg shadow-emerald-100

                hover:shadow-emerald-200 transition-all duration-200"
            >
              Create Account
            </motion.button>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleLogin />
            </div>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Register;
