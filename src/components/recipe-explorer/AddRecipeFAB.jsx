import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/outline";

const AddRecipeFAB = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 p-4 rounded-full 
        bg-gradient-to-r from-emerald-500 to-cyan-500 
        text-white shadow-lg shadow-emerald-500/20
        hover:shadow-xl hover:shadow-emerald-500/30 
        transition-shadow duration-300"
    >
      <PlusIcon className="w-8 h-8" />
    </motion.button>
  );
};

export default AddRecipeFAB;
