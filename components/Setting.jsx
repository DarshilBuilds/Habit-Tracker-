import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './ThemeContext'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};

const rowVariant = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.32, ease: 'easeOut' } }
};

const backdropVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const modalVariant = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
  exit: { opacity: 0, scale: 0.92, y: 16, transition: { duration: 0.18, ease: 'easeIn' } }
};

function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteData = () => {
    const theme = localStorage.getItem("theme");
    localStorage.clear();
    if (theme) localStorage.setItem("theme", theme);
    setShowConfirm(false);
    window.location.reload();
  };

  return (
    <>
      <motion.div
        className="min-h-screen bg-white dark:bg-gray-900 px-6 py-10 transition-colors shadow-lg rounded-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={fadeUp}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Manage your appearance and data preferences.
            </p>
          </motion.div>

          {/* Settings Panel */}
          <motion.div
            variants={fadeUp}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700"
          >
            {/* Appearance Row */}
            <motion.div
              variants={rowVariant}
              className="flex items-center justify-between p-5"
            >
              <div>
                <h2 className="text-sm font-medium text-gray-900 dark:text-white">Appearance</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Switch between light and dark mode.
                </p>
              </div>

              {/* Toggle switch */}
              <motion.button
                onClick={toggleDarkMode}
                role="switch"
                aria-checked={darkMode}
                aria-label="Toggle dark mode"
                whileTap={{ scale: 0.92 }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer ${
                  darkMode ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`inline-block h-4 w-4 rounded-full bg-white ${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </motion.button>
            </motion.div>

            {/* Delete Data Row */}
            <motion.div
              variants={rowVariant}
              className="flex items-center justify-between p-5"
            >
              <div>
                <h2 className="text-sm font-medium text-gray-900 dark:text-white">Delete all data</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Permanently remove all habits and tracked data stored on this device.
                </p>
              </div>
              <motion.button
                onClick={() => setShowConfirm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
              >
                Delete data
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/30 flex items-center justify-center px-4 z-50"
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-6"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning icon */}
              <motion.div
                className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.1 }}
              >
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>

              <motion.h3
                className="text-base font-semibold text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.25 }}
              >
                Delete all data?
              </motion.h3>

              <motion.p
                className="text-sm text-gray-500 dark:text-gray-400 mt-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.25 }}
              >
                This will permanently erase all habits, logs, and settings stored
                locally. This can't be undone.
              </motion.p>

              <motion.div
                className="flex justify-end gap-3 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.25 }}
              >
                <motion.button
                  onClick={() => setShowConfirm(false)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteData}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm font-medium text-white bg-red-600 px-3 py-1.5 rounded-md hover:bg-red-700 cursor-pointer"
                >
                  Delete everything
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Settings;