import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadAllHabitDays, calculateHabitStreak } from "../src/utils/habitStorage";

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerList = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } }
};

const rowVariant = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: 16, transition: { duration: 0.2 } }
};

// Animated counter for streak number
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    let start = 0;
    const duration = 600;
    const stepTime = 16;
    const steps = Math.ceil(duration / stepTime);
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{display}</span>;
}

function OverallProgressCard() {
  const [habits, setHabits] = useState([]);
  const [completedays, setcompletedays] = useState({});

  const refreshData = () => {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) setHabits(JSON.parse(storedHabits));
    const allData = loadAllHabitDays();
    setcompletedays(allData);
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('habitDataChanged', refreshData);
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener('habitDataChanged', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  const getStreak = (habitId) => {
    return calculateHabitStreak(habitId, completedays, new Date());
  };

  return (
    <motion.div
      className="w-full rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_10px_30px_var(--shadow)] transition-colors sm:p-5"
      variants={cardVariant}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.span
          className="material-symbols-outlined text-[var(--accent)]"
          initial={{ rotate: -20, scale: 0.5 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
        >
          bar_chart
        </motion.span>
        <div>
          <h3 className="font-semibold text-[var(--text)]">
            Overall Progress
          </h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Your current streak momentum at a glance.</p>
        </div>
      </motion.div>

      {/* Habit Rows */}
      <motion.div
        className="flex flex-col divide-y divide-[var(--border)] pt-5"
        variants={staggerList}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {habits.length === 0 ? (
            <motion.p
              key="empty"
              variants={rowVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="py-4 text-center text-sm text-[var(--text-muted)]"
            >
              No habits listed yet.
            </motion.p>
          ) : (
            habits.map((habit) => {
              const streak = getStreak(habit.id);
              return (
                <motion.div
                  key={habit.id || habit.name}
                  variants={rowVariant}
                  exit="exit"
                  layout
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  {/* Left: Habit Details */}
                  <div className="flex flex-col">
                    <motion.span
                      className="text-base font-semibold capitalize text-[var(--text)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {habit.name}
                    </motion.span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {habit.category || 'Routine'}
                    </span>
                  </div>

                  {/* Right: Streak Badge */}
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.span
                      className="flex items-center gap-1 rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]"
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <motion.span
                        animate={streak > 0 ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.4 }}
                      >
                        🔥
                      </motion.span>
                      <AnimatedNumber value={streak} /> day streak
                    </motion.span>
                  </motion.div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default OverallProgressCard;