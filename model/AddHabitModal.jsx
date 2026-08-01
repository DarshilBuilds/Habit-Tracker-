import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const backdropVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariant = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 28 } },
  exit: { opacity: 0, scale: 0.92, y: 16, transition: { duration: 0.18, ease: "easeIn" } }
};

const fieldVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const staggerFields = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
};

const iconGridVariant = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 25 } },
  exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.15 } }
};

function AddHabitModal({ isOpen, onClose, onCreateHabit }) {
  const [isIconOpen, setIconOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("📄");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("Once daily");
  const [allMonths, setAllMonths] = useState(true);

  const icons = [
    "🏃‍♂️", "📚", "💧", "🍎", "🎵", "🎯",
    "📄", "☕", "💻", "🌙", "🏋️‍♂️", "🧘‍♂️",
    "📖", "🚶‍♂️", "🍵", "📝", "🔥", "✅"
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHabit = {
      id: String(Date.now()),
      name: name.trim(),
      description: description.trim(),
      icon: selectedIcon,
      goal,
      allMonths
    };

    onCreateHabit(newHabit);
    setName("");
    setDescription("");
    setSelectedIcon("📄");
    setGoal("Once daily");
    setAllMonths(true);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          variants={backdropVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          onClick={onClose} // click outside to close
        >
          {/* Modal Panel */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // prevent backdrop click
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute right-4 top-4 cursor-pointer text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
            >
              ✕
            </motion.button>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.25 }}
            >
              <h2 className="text-lg font-semibold text-[var(--text)]">Add New Habit</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Create a new habit to track daily.</p>
            </motion.div>

            {/* Fields */}
            <motion.div
              className="mt-6 space-y-4"
              variants={staggerFields}
              initial="hidden"
              animate="visible"
            >
              {/* Name */}
              <motion.div variants={fieldVariant} transition={{ duration: 0.25 }}>
                <label className="mb-1 block text-sm font-medium text-[var(--text)]">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Drink 8 glasses of water"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </motion.div>

              {/* Description */}
              <motion.div variants={fieldVariant} transition={{ duration: 0.25 }}>
                <label className="mb-1 block text-sm font-medium text-[var(--text)]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description..."
                  rows="3"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </motion.div>

              {/* Icon Picker */}
              <motion.div variants={fieldVariant} transition={{ duration: 0.25 }} className="relative">
                <label className="mb-1 block text-sm font-medium text-[var(--text)]">Icon</label>

                <motion.button
                  type="button"
                  onClick={() => setIconOpen(!isIconOpen)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex w-24 cursor-pointer items-center justify-between rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
                >
                  <motion.span
                    key={selectedIcon}
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="text-xl"
                  >
                    {selectedIcon}
                  </motion.span>
                  <motion.span
                    animate={{ rotate: isIconOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="material-symbols-outlined"
                  >
                    keyboard_arrow_down
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {isIconOpen && (
                    <motion.div
                      variants={iconGridVariant}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute z-10 mt-2 grid grid-cols-6 gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg"
                    >
                      {icons.map((icon, i) => (
                        <motion.button
                          key={icon}
                          type="button"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.02, type: "spring", stiffness: 400, damping: 18 }}
                          whileHover={{ scale: 1.3 }}
                          whileTap={{ scale: 0.9 }}
                          className="cursor-pointer rounded-md p-1 text-xl transition-colors hover:bg-[var(--surface-muted)]"
                          onClick={() => {
                            setSelectedIcon(icon);
                            setIconOpen(false);
                          }}
                        >
                          {icon}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* All Months Checkbox */}
              <motion.div variants={fieldVariant} transition={{ duration: 0.25 }} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={allMonths}
                  onChange={(e) => setAllMonths(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">All months (default)</p>
                  <p className="text-xs text-[var(--text-muted)]">This habit will appear in all months</p>
                </div>
              </motion.div>

              {/* Goal */}
              <motion.div variants={fieldVariant} transition={{ duration: 0.25 }}>
                <label className="mb-1 block text-sm font-medium text-[var(--text)]">Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]"
                >
                  <option>Once daily</option>
                </select>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="mt-6 flex justify-end gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.25 }}
            >
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="cursor-pointer rounded-md border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-muted)]"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleCreate}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="cursor-pointer rounded-md bg-[var(--accent)] px-4 py-2 text-sm text-white transition hover:bg-[var(--accent-hover)]"
              >
                Create Habit
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AddHabitModal;