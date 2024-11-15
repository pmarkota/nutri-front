import PropTypes from "prop-types";

import { motion } from "framer-motion";

const ReviewsList = ({ reviews }) => {
  const container = {
    hidden: { opacity: 0 },

    show: {
      opacity: 1,

      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },

    show: { y: 0, opacity: 1 },
  };

  const getGradientByRating = (rating) => {
    const gradients = {
      5: "from-emerald-500/10 to-cyan-500/10 dark:from-emerald-600/20 dark:to-cyan-600/20",

      4: "from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20",

      3: "from-yellow-500/10 to-orange-500/10 dark:from-yellow-600/20 dark:to-orange-600/20",

      2: "from-orange-500/10 to-red-500/10 dark:from-orange-600/20 dark:to-red-600/20",

      1: "from-red-500/10 to-pink-500/10 dark:from-red-600/20 dark:to-pink-600/20",
    };

    return gradients[rating] || gradients[3];
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };

    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (username) => {
    if (!username) return "?";

    return username

      .split(" ")

      .map((name) => name.charAt(0))

      .join("")

      .toUpperCase();
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 

            dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm border border-gray-200/50 

            dark:border-gray-700/50"
        >
          <span className="text-4xl mb-4 block">📝</span>

          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No reviews yet. Be the first to share your thoughts!
          </p>
        </motion.div>
      ) : (
        reviews.map((review) => (
          <motion.div
            key={review.id}
            variants={item}
            className="relative group"
          >
            <div
              className={`

              p-6 rounded-2xl backdrop-blur-sm

              bg-gradient-to-br ${getGradientByRating(review.rating)}

              border border-white/20 dark:border-gray-700/20

              hover:shadow-lg transition-all duration-300

              hover:scale-[1.02]

            `}
            >
              {/* Rating Display */}

              <div
                className="absolute -top-3 right-4 px-4 py-1 rounded-full 

                bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">★</span>

                  <span
                    className="font-bold bg-gradient-to-r from-yellow-500 to-amber-500 

                    bg-clip-text text-transparent"
                  >
                    {review.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* User Info and Date */}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 

                  flex items-center justify-center text-white font-bold text-lg"
                >
                  {getInitials(review.username || "Anonymous")}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {review.username || "Anonymous User"}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>

              {/* Review Content */}

              <div className="ml-13">
                {/* Rating Stars */}

                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`text-2xl ${
                        index < review.rating
                          ? "text-yellow-500"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>

                {/* Comment */}

                <div className="relative">
                  <div
                    className="absolute -left-6 top-0 h-full w-1 rounded-full 

                    bg-gradient-to-b from-emerald-500/20 to-cyan-500/20"
                  />

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}

              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 

                transition-opacity duration-300 pointer-events-none"
              >
                <div
                  className="absolute -right-2 -bottom-2 w-24 h-24 

                  bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 

                  rounded-full blur-xl"
                />

                <div
                  className="absolute -left-2 -top-2 w-24 h-24 

                  bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 

                  rounded-full blur-xl"
                />
              </div>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

ReviewsList.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,

      rating: PropTypes.number.isRequired,

      comment: PropTypes.string.isRequired,

      createdAt: PropTypes.string.isRequired,

      username: PropTypes.string,
    })
  ).isRequired,
};

export default ReviewsList;
