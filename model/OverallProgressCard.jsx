import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) setHabits(JSON.parse(storedHabits));
  }, []);

  useEffect(() => {
    const savedata = localStorage.getItem('habit_tracker_days');
    if (savedata) setcompletedays(JSON.parse(savedata));
  }, []);

  const calculateStreak = (habitId) => {
    const habitDays = completedays[habitId] || {};
    const today = new Date();
    let streak = 0;
    let checkDay = today.getDate();

    while (checkDay > 0) {
      if (habitDays[checkDay]) {
        streak++;
        checkDay--;
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <motion.div
      className="w-fit min-w-[320px] max-w-xl p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors"
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
          className="material-symbols-outlined text-gray-700 dark:text-gray-300"
          initial={{ rotate: -20, scale: 0.5 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
        >
          bar_chart
        </motion.span>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-5">
          Overall Progress
        </h3>
      </motion.div>

      {/* Habit Rows */}
      <motion.div
        className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700"
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
              className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center"
            >
              No habits listed yet.
            </motion.p>
          ) : (
            habits.map((habit) => {
              const streak = calculateStreak(habit.id || habit.name);
              return (
                <motion.div
                  key={habit.id || habit.name}
                  variants={rowVariant}
                  exit="exit"
                  layout
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 gap-8"
                >
                  {/* Left: Habit Details */}
                  <div className="flex flex-col">
                    <motion.span
                      className="text-base font-semibold text-gray-700 dark:text-gray-200 capitalize"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {habit.name}
                    </motion.span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
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
                      className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md flex items-center gap-1"
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