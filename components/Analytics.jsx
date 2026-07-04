import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// Animated counter hook
function useCountUp(target, duration = 900) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const isString = typeof target === 'string';
    const numericTarget = isString ? parseInt(target) : target;
    if (isNaN(numericTarget)) return;

    const start = prev.current;
    const diff = numericTarget - start;
    if (diff === 0) return;

    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else prev.current = numericTarget;
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return display;
}

// Animated stat value — handles "72%", "5 days", or plain numbers
function AnimatedValue({ value }) {
  const suffix = typeof value === 'string' ? value.replace(/[0-9]/g, '') : '';
  const numeric = typeof value === 'string' ? parseInt(value) : value;
  const counted = useCountUp(isNaN(numeric) ? 0 : numeric);
  if (isNaN(numeric)) return <span>{value}</span>;
  return <span>{counted}{suffix}</span>;
}

// Variants
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } }
};

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 24 } }
};

const rowVariant = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { opacity: 0, x: 14, transition: { duration: 0.18 } }
};

// Animated sparkline with draw-on effect
function SparkLine() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef(null);

  const months = ["Nov 2024", "Dec 2024", "Jan 2025"];
  const w = 600, h = 200, padL = 36, padB = 36, padR = 24, padT = 16;
  const inner_w = w - padL - padR;
  const inner_h = h - padT - padB;
  const yZero = padT + inner_h;

  const points = months.map((_, i) => {
    const x = padL + (i / (months.length - 1)) * inner_w;
    return { x, y: yZero };
  });

  const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" display="block">
      {[0, 1].map((tick) => {
        const y = padT + inner_h - tick * inner_h;
        return (
          <g key={tick}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#E5E7EB" strokeWidth="1" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#9CA3AF">{tick}</text>
          </g>
        );
      })}

      {/* Animated line draw */}
      <motion.polyline
        ref={pathRef}
        points={pointsStr}
        fill="none"
        stroke="#7C6FF7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        initial={{ strokeDashoffset: pathLength, opacity: 0 }}
        animate={inView ? { strokeDashoffset: 0, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
      />

      {/* Animated dots */}
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="5"
          fill="#7C6FF7"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.4 + i * 0.15 }}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
        />
      ))}

      {months.map((m, i) => {
        const x = padL + (i / (months.length - 1)) * inner_w;
        return (
          <motion.text
            key={m}
            x={x}
            y={h - 8}
            textAnchor="middle"
            fontSize="11"
            fill="#9CA3AF"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            {m}
          </motion.text>
        );
      })}
    </svg>
  );
}

function Analytics() {
  const [range, setRange] = useState("Last 3 Months");
  const [totalHabits, setTotalHabits] = useState(0);
  const [avgCompletion, setAvgCompletion] = useState("0%");
  const [longestStreak, setLongestStreak] = useState("0 days");
  const [topHabits, setTopHabits] = useState([]);

  const stats = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <circle cx="12" cy="12" r="10" stroke="#7C6FF7" strokeWidth="2" />
          <circle cx="12" cy="12" r="5" stroke="#7C6FF7" strokeWidth="2" />
          <circle cx="12" cy="12" r="1.5" fill="#7C6FF7" />
        </svg>
      ),
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
      label: "Active Habits",
      value: totalHabits,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <polyline points="3 17 9 11 13 15 21 7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="17 7 21 7 21 11" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      iconBg: "bg-green-100 dark:bg-green-900/40",
      label: "Avg. Completion",
      value: avgCompletion,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <circle cx="12" cy="8" r="4" stroke="#F59E0B" strokeWidth="2" />
          <path d="M8 14h8l1 7H7l1-7z" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
      iconBg: "bg-amber-100 dark:bg-amber-900/40",
      label: "Longest Streak",
      value: longestStreak,
    },
  ];

  useEffect(() => {
    let activeHabits = [];
    let activeHabitIds = [];
    let habitsCount = 0;

    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      try {
        const parsedHabits = JSON.parse(storedHabits);
        if (Array.isArray(parsedHabits)) {
          habitsCount = parsedHabits.length;
          setTotalHabits(habitsCount);
          activeHabits = parsedHabits;
          activeHabitIds = parsedHabits.map(h => String(h.id));
        }
      } catch (error) { console.error(error); }
    }

    const savedData = localStorage.getItem('habit_tracker_days');
    if (savedData && habitsCount > 0) {
      try {
        const parsedData = JSON.parse(savedData);
        let actualCheckedCount = 0;
        let maxOverallStreak = 0;
        const currentDayOfMonth = new Date().getDate();

        const habitStats = activeHabits.map((habit) => {
          const habitId = String(habit.id);
          const habitDaysObj = parsedData[habitId] || {};
          let currentStreak = 0;
          let maxHabitStreak = 0;
          let checkedCount = 0;

          for (let day = 1; day <= currentDayOfMonth; day++) {
            const isChecked = habitDaysObj[day];
            if (isChecked === true || isChecked === "true") {
              currentStreak += 1;
              checkedCount += 1;
              if (currentStreak > maxHabitStreak) maxHabitStreak = currentStreak;
            } else {
              currentStreak = 0;
            }
          }

          if (maxHabitStreak > maxOverallStreak) maxOverallStreak = maxHabitStreak;

          const pct = currentDayOfMonth > 0
            ? Math.min(100, Math.round((checkedCount / currentDayOfMonth) * 100)) : 0;

          return {
            id: habitId,
            name: habit.name || habit.title || "Unnamed habit",
            icon: habit.icon || habit.emoji || "✅",
            streakValue: maxHabitStreak,
            streak: `${maxHabitStreak} ${maxHabitStreak === 1 ? 'day' : 'days'} streak`,
            pct: `${pct}%`,
          };
        });

        setLongestStreak(`${maxOverallStreak} ${maxOverallStreak === 1 ? 'day' : 'days'}`);

        const sorted = [...habitStats]
          .sort((a, b) => b.streakValue - a.streakValue)
          .map((h, i) => ({ ...h, rank: i + 1 }));
        setTopHabits(sorted);

        Object.entries(parsedData).forEach(([habitId, habitDaysObj]) => {
          if (activeHabitIds.includes(String(habitId)) && habitDaysObj && typeof habitDaysObj === 'object') {
            Object.values(habitDaysObj).forEach((isChecked) => {
              if (isChecked === true || isChecked === "true") actualCheckedCount += 1;
            });
          }
        });

        const totalPossible = habitsCount * currentDayOfMonth;
        if (totalPossible > 0) {
          const raw = Math.round((actualCheckedCount / totalPossible) * 100);
          setAvgCompletion(`${raw > 100 ? 100 : raw}%`);
        } else {
          setAvgCompletion("0%");
        }

      } catch (error) {
        console.error(error);
        setAvgCompletion("0%");
        setLongestStreak("0 days");
        setTopHabits([]);
      }
    } else {
      setAvgCompletion("0%");
      setLongestStreak("0 days");
      setTopHabits(
        activeHabits.map((habit, i) => ({
          id: String(habit.id), rank: i + 1,
          name: habit.name || habit.title || "Unnamed habit",
          icon: habit.icon || habit.emoji || "✅",
          streakValue: 0, streak: "0 days streak", pct: "0%",
        }))
      );
    }
  }, []);

  const calculateStreak = (habitId) => {
    try {
      const savedData = localStorage.getItem('habit_tracker_days');
      if (!savedData) return 0;
      const parsedData = JSON.parse(savedData);
      const habitDays = parsedData[String(habitId)] || {};
      let streak = 0;
      let checkDay = new Date().getDate();
      while (checkDay > 0) {
        const val = habitDays[checkDay];
        if (val === true || val === "true") { streak++; checkDay--; }
        else break;
      }
      return streak;
    } catch { return 0; }
  };

  return (
    <motion.div
      className="min-h-screen dark:bg-gray-900 p-6 font-sans transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-start justify-between mb-7"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your progress and identify patterns
          </p>
        </motion.div>

        <motion.select
          variants={fadeUp}
          value={range}
          onChange={(e) => setRange(e.target.value)}
          whileHover={{ scale: 1.03 }}
          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option>Last 3 Months</option>
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </motion.select>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        className="grid grid-cols-4 gap-4 mb-5"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={cardVariant}
            whileHover={{ scale: 1.03, y: -2, transition: { duration: 0.18 } }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm flex items-start gap-4 cursor-default"
          >
            <motion.div
              className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}
              initial={{ rotate: -15, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
            >
              {s.icon}
            </motion.div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                <AnimatedValue value={s.value} />
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Row */}
      <motion.div
        className="grid gap-4"
        style={{ gridTemplateColumns: "1.9fr 1fr" }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Monthly Progress Trend */}
        <motion.div
          variants={cardVariant}
          whileHover={{ scale: 1.01, transition: { duration: 0.18 } }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Monthly Progress Trend</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Completion rates over time</p>
          <div className="h-48">
            <SparkLine />
          </div>
        </motion.div>

        {/* Top Performing Habits */}
        <motion.div
          variants={cardVariant}
          whileHover={{ scale: 1.01, transition: { duration: 0.18 } }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Top Performing Habits</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">This month's best habits</p>

          <AnimatePresence mode="popLayout">
            {topHabits.length === 0 ? (
              <motion.p
                key="empty"
                variants={rowVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-xs text-gray-400 dark:text-gray-500 pt-2"
              >
                No habits found.
              </motion.p>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {topHabits.map((h) => (
                  <motion.div
                    key={h.id}
                    variants={rowVariant}
                    exit="exit"
                    layout
                    className="flex items-center gap-3 py-2.5 border-t border-gray-100 dark:border-gray-700"
                  >
                    {/* Rank badge */}
                    <motion.span
                      className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-xs font-bold text-indigo-500 dark:text-indigo-300 shrink-0"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 16, delay: h.rank * 0.06 }}
                    >
                      {h.rank}
                    </motion.span>

                    {/* Emoji */}
                    <motion.span
                      className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg shrink-0"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 18, delay: h.rank * 0.06 + 0.05 }}
                    >
                      {h.icon}
                    </motion.span>

                    <div className="flex min-w-0 align-center justify-between gap-2">
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{h.name}</p>
                      <motion.span
                        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md mt-0.5"
                        whileHover={{ scale: 1.07 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <motion.span
                          animate={calculateStreak(h.id) > 0 ? { scale: [1, 1.3, 1] } : {}}
                          transition={{ repeat: Infinity, repeatDelay: 2.5, duration: 0.35 }}
                        >
                          🔥
                        </motion.span>
                        {calculateStreak(h.id)} day streak
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Analytics;