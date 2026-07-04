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
      className="flex items-center justify-center pl-6"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-full max-w-4xl overflow-hidden p-6 transition-colors">

        {/* Header */}
        <motion.div
          className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700"
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

            <span className="text-base font-bold text-gray-800 dark:text-white tracking-tight flex gap-1">
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
            className="bg-indigo-600 text-white text-xs font-bold px-6 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
          >
            + Add Habit
          </motion.button>
        </motion.div>

        {/* Grid Area */}
        <div className="flex flex-col">

          {/* Days Header */}
          <motion.div
            className="flex items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 text-xs font-bold text-gray-400 dark:text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="w-64 p-4 shrink-0 text-left border-r border-gray-200 dark:border-gray-700 pl-6">
              Habit
            </div>
            <div
              ref={headerScrollRef}
              onScroll={(e) => handleScroll(e.currentTarget)}
              className="flex-1 flex overflow-x-auto scrollbar-none divide-x divide-gray-100 select-none"
            >
              {Array.from({ length: daysCount }, (_, i) => (
                <div key={i + 1} className="min-w-[48px] p-3 text-center">
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
                className="text-center py-12 text-sm text-gray-400 dark:text-gray-500 font-medium"
              >
                No habits created yet. Click "+ Add Habit" to start tracking!
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="divide-y divide-gray-200 dark:divide-gray-700"
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
                    className="flex items-center hover:bg-gray-50/30 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    {/* Habit Name Column */}
                    <div className="w-64 p-4 shrink-0 flex items-center justify-between gap-3 border-r border-gray-200 dark:border-gray-700 pl-6 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <motion.span
                          className="text-xl shrink-0"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: index * 0.07 }}
                        >
                          {habit.icon || "📝"}
                        </motion.span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
                          {habit.name}
                        </span>
                      </div>

                      <motion.span
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="material-symbols-outlined cursor-pointer text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 ml-auto"
                        onClick={() => handleDeleteClick(habit.id)}
                      >
                        delete
                      </motion.span>
                    </div>

                    {/* Day Checkboxes */}
                    <div
                      ref={(el) => (rowRefs.current[index] = el)}
                      onScroll={(e) => handleScroll(e.currentTarget)}
                      className="flex-1 flex overflow-x-auto scrollbar-thin divide-x divide-gray-100 dark:divide-gray-700"
                    >
                      {Array.from({ length: daysCount }, (_, i) => {
                        const day = i + 1;
                        const isDone = completedays[habit.id]?.[day];

                        return (
                          <div key={day} className="min-w-[48px] p-3 flex items-center justify-center">
                            <motion.button
                              onClick={() => toggleDay(habit.id, day)}
                              whileTap={{ scale: 0.8 }}
                              animate={isDone ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                              className={`w-6 h-6 rounded border transition-colors flex items-center justify-center cursor-pointer
                                ${isDone
                                  ? 'bg-emerald-500 border-emerald-600 shadow-sm text-white'
                                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400'
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