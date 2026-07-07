import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AddHabitModal from './AddHabitModal'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerList = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 }
  }
};

const rowVariant = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16, transition: { duration: 0.2 } }
};

function Habitcard() {
  const [habits, setHabits] = useState([]);
  const [open, setOpen] = useState(false);
  const [daysCount, setDaysCount] = useState(0);
  const [completedays, setcompletedays] = useState({});

  const headerScrollRef = useRef(null);
  const rowRefs = useRef([]);

  const date = new Date();
  const fullyear = date.getFullYear();
  const month = new Date().toLocaleDateString("default", { month: "long" });

  const getDaysInCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  useEffect(() => { setDaysCount(getDaysInCurrentMonth()); }, []);

  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) setHabits(JSON.parse(storedHabits));
  }, []);

  useEffect(() => {
    const savedata = localStorage.getItem('habit_tracker_days');
    if (savedata) setcompletedays(JSON.parse(savedata));
  }, []);

  const handleDeleteClick = (habitId) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      const updatedHabits = habits.filter((habit) => habit.id !== habitId);
      setHabits(updatedHabits);
      localStorage.setItem("habits", JSON.stringify(updatedHabits));
      window.location.reload();
    }
  };

  const onCreateHabit = (newHabit) => {
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    localStorage.setItem("habits", JSON.stringify(updatedHabits));
    window.location.reload();
    setOpen(false);
  };

  const toggleDay = (habitId, daynumber) => {
    const currentHabitRecords = completedays[habitId] || {};
    const updatedays = {
      ...completedays,
      [habitId]: {
        ...currentHabitRecords,
        [daynumber]: !currentHabitRecords[daynumber]
      }
    };
    setcompletedays(updatedays);
    localStorage.setItem('habit_tracker_days', JSON.stringify(updatedays));
    // ⚠️ Removed window.location.reload() — it kills animations.
    // State update above is enough to re-render the checkmarks.
  };

  const handleScroll = (scrolledElement) => {
    const scrollLeftPosition = scrolledElement.scrollLeft;
    if (headerScrollRef.current && headerScrollRef.current !== scrolledElement) {
      headerScrollRef.current.scrollLeft = scrollLeftPosition;
    }
    rowRefs.current.forEach((row) => {
      if (row && row !== scrolledElement) {
        row.scrollLeft = scrollLeftPosition;
      }
    });
  };

  return (
    <motion.div
      className="flex w-full items-center justify-center"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="w-full overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_10px_30px_var(--shadow)] transition-colors sm:p-4 lg:p-5">

        {/* Header */}
        <motion.div
          className="flex flex-col gap-3 border-b border-[var(--border)] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
            >‹</motion.button>

            <span className="flex gap-1 text-base font-bold tracking-tight text-[var(--text)]">
              {month} {fullyear}
            </span>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
            >›</motion.button>
          </div>

          <motion.button
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer rounded-full bg-[var(--accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[var(--accent-hover)]"
          >
            + Add Habit
          </motion.button>
        </motion.div>

        {/* Grid Area */}
        <div className="flex flex-col">

          {/* Days Header */}
          <motion.div
            className="flex items-center border-b border-[var(--border)] bg-[var(--surface-muted)] text-xs font-bold text-[var(--text-muted)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="w-40 shrink-0 border-r border-[var(--border)] p-3 pl-3 text-left sm:w-52 sm:p-4 sm:pl-4">
              Habit
            </div>
            <div
              ref={headerScrollRef}
              onScroll={(e) => handleScroll(e.currentTarget)}
              className="flex flex-1 select-none overflow-hidden divide-x divide-(--border)"
            >
              {Array.from({ length: daysCount }, (_, i) => (
                <div key={i + 1} className="min-w-11 p-3 text-center">
                  {i + 1}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Habit Rows */}
          <AnimatePresence mode="popLayout">
            {habits.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="py-12 text-center text-sm font-medium text-[var(--text-muted)]"
              >
                No habits created yet. Click "+ Add Habit" to start tracking!
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="divide-y divide-[var(--border)]"
                variants={staggerList}
                initial="hidden"
                animate="visible"
              >
                {habits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    variants={rowVariant}
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="flex items-center transition-colors hover:bg-[var(--surface-muted)]"
                  >
                    {/* Habit Name Column */}
                    <div className="w-52 p-4 shrink-0 flex items-center justify-between gap-3 border-r border-gray-200 dark:border-gray-700 pl-6 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <motion.span
                          className="text-xl shrink-0"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: index * 0.07 }}
                        >
                          {habit.icon || "📝"}
                        </motion.span>
                        <span className="truncate text-sm font-semibold text-[var(--text)]">
                          {habit.name}
                        </span>
                      </div>

                      <motion.span
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="material-symbols-outlined ml-auto shrink-0 cursor-pointer text-[var(--text-muted)] opacity-0 transition-opacity duration-200 hover:text-[var(--danger)] group-hover:opacity-100"
                        onClick={() => handleDeleteClick(habit.id)}
                      >
                        delete
                      </motion.span>
                    </div>

                    {/* Day Checkboxes */}
                    <div
                      ref={(el) => (rowRefs.current[index] = el)}
                      onScroll={(e) => handleScroll(e.currentTarget)}
                      className="flex flex-1 overflow-x-auto divide-x divide-[var(--border)]"
                    >
                      {Array.from({ length: daysCount }, (_, i) => {
                        const day = i + 1;
                        const isDone = completedays[habit.id]?.[day];

                        return (
                          <div key={day} className="flex min-w-[38px] items-center justify-center p-2 sm:min-w-[44px] sm:p-3">
                            <motion.button
                              onClick={() => toggleDay(habit.id, day)}
                              whileTap={{ scale: 0.8 }}
                              animate={isDone ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                              className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border transition-colors sm:h-6 sm:w-6
                                ${isDone
                                  ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-sm'
                                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]'
                                }`}
                            >
                              <AnimatePresence>
                                {isDone && (
                                  <motion.svg
                                    key="check"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    initial={{ opacity: 0, scale: 0, rotate: -30 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0, rotate: 30 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </motion.svg>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AddHabitModal isOpen={open} onClose={() => setOpen(false)} onCreateHabit={onCreateHabit} />
    </motion.div>
  );
}

export default Habitcard;