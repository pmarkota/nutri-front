import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import TimerComponent from "./TimerComponent";

export default function CookingMode({
  recipe,
  onClose,
  activeStep,
  setActiveStep,
  playComplete,
  playClick,
}) {
  const instructions = recipe?.instructions?.split("\n").filter(Boolean) || [];

  const handleNext = () => {
    playClick();
    if (activeStep < instructions.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      playComplete();
      onClose();
    }
  };

  const handlePrevious = () => {
    playClick();
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-3xl transform overflow-hidden rounded-2xl
                bg-white dark:bg-gray-800 p-6 shadow-xl transition-all"
              >
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  Cooking Mode
                </Dialog.Title>

                {/* Progress Bar */}
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((activeStep + 1) / instructions.length) * 100
                      }%`,
                    }}
                    className="absolute h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                  />
                </div>

                {/* Timer */}
                <div className="mb-8">
                  <TimerComponent playComplete={playComplete} />
                </div>

                {/* Current Step */}
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Step {activeStep + 1} of {instructions.length}
                  </div>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {instructions[activeStep]}
                  </p>
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevious}
                    disabled={activeStep === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700
                      text-gray-900 dark:text-white font-medium
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500
                      text-white font-medium"
                  >
                    {activeStep === instructions.length - 1 ? "Finish" : "Next"}
                  </motion.button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

CookingMode.propTypes = {
  recipe: PropTypes.shape({
    instructions: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  setActiveStep: PropTypes.func.isRequired,
  playComplete: PropTypes.func.isRequired,
  playClick: PropTypes.func.isRequired,
};
