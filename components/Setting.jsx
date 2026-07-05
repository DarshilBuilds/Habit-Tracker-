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
        className="min-h-screen rounded-[28px] border border-[var(--border)] bg-[var(--surface)] px-4 py-8 shadow-[0_10px_30px_var(--shadow)] transition-colors sm:px-6 sm:py-10"
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
            <div className="mb-3 inline-flex items-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Preferences
            </div>
            <h1 className="mb-1 text-2xl font-bold text-[var(--text)]">
              Settings
            </h1>
            <p className="mb-8 text-sm text-[var(--text-muted)]">
              Manage your appearance and data preferences.
            </p>
          </motion.div>

          {/* Settings Panel */}
          <motion.div
            variants={fadeUp}
            className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]"
          >
            {/* Appearance Row */}
            <motion.div
              variants={rowVariant}
              className="flex items-center justify-between p-5"
            >
              <div>
                <h2 className="text-sm font-medium text-[var(--text)]">Appearance</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
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
                className={`relative inline-flex h-7 w-14 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 ${
                  darkMode ? "bg-[var(--accent)]" : "bg-[var(--surface-strong)]"
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm ${
                    darkMode ? "translate-x-7" : "translate-x-1"
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
                <h2 className="text-sm font-medium text-[var(--text)]">Delete all data</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Permanently remove all habits and tracked data stored on this device.
                </p>
              </div>
              <motion.button
                onClick={() => setShowConfirm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="cursor-pointer rounded-md border border-[var(--danger)]/30 px-3 py-1.5 text-sm font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger-soft)]"
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
              className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning icon */}
              <motion.div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--danger-soft)]"
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
                className="text-base font-semibold text-[var(--text)]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.25 }}
              >
                Delete all data?
              </motion.h3>

              <motion.p
                className="mt-2 text-sm text-[var(--text-muted)]"
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
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)]"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteData}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer rounded-md bg-[var(--danger)] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:brightness-110"
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