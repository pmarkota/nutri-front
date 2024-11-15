import { motion } from "framer-motion";

const FloatingElements = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Background gradient orbs */}
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-1/2 -right-1/2 w-full h-full 
        bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 
        rounded-full blur-3xl"
    />
    <motion.div
      animate={{
        scale: [1.2, 1, 1.2],
        rotate: [360, 180, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute -bottom-1/2 -left-1/2 w-full h-full 
        bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 
        rounded-full blur-3xl"
    />

    {/* Floating elements */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 
          rounded-full blur-xl"
        style={{
          width: `${Math.random() * 100 + 50}px`,
          height: `${Math.random() * 100 + 50}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 10 + Math.random() * 5,
          repeat: Infinity,
          ease: "linear",
          delay: i * 0.5,
        }}
      />
    ))}

    {/* Sparkles */}
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={`sparkle-${i}`}
        className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default FloatingElements;
