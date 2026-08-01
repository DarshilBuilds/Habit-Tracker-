import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { loadAllHabitDays, getYearMonthKey, calculateHabitStreak } from '../src/utils/habitStorage'

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
function SparkLine({ allDaysData = {}, habitsCount = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef(null);

  const now = new Date();
  const monthDataList = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = getYearMonthKey(d);
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const label = d.toLocaleDateString("default", { month: "short", year: "numeric" });

    let checkedCount = 0;
    const monthObj = allDaysData[key] || {};
    Object.values(monthObj).forEach((habitDays) => {
      if (habitDays && typeof habitDays === 'object') {
        Object.values(habitDays).forEach((v) => {
          if (v === true || v === "true") checkedCount++;
        });
      }
    });

    const isCurrentMonth = i === 0;
    const daysToConsider = isCurrentMonth ? Math.max(1, now.getDate()) : daysInMonth;
    const maxPossible = (habitsCount > 0 ? habitsCount : 1) * daysToConsider;
    const rate = Math.min(1, checkedCount / maxPossible);

    monthDataList.push({ label, rate });
  }

  const w = 600, h = 200, padL = 36, padB = 36, padR = 24, padT = 16;
  const inner_w = w - padL - padR;
  const inner_h = h - padT - padB;

  const points = monthDataList.map((m, i) => {
    const x = padL + (i / (monthDataList.length - 1)) * inner_w;
    const y = padT + inner_h - m.rate * inner_h;
    return { x, y };
  });

  const pointsStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [pointsStr]);

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

      {monthDataList.map((m, i) => {
        const x = padL + (i / (monthDataList.length - 1)) * inner_w;
        return (
          <motion.text
            key={m.label}
            x={x}
            y={h - 8}
            textAnchor="middle"
            fontSize="11"
            fill="#9CA3AF"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            {m.label}
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
  const [allDaysData, setAllDaysData] = useState({});

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

    const parsedData = loadAllHabitDays();
    setAllDaysData(parsedData);

    if (habitsCount > 0) {
      try {
        let actualCheckedCount = 0;
        let maxOverallStreak = 0;
        const now = new Date();
        const currentMonthKey = getYearMonthKey(now);
        const currentDayOfMonth = now.getDate();
        const currentMonthRecords = parsedData[currentMonthKey] || {};

        const habitStats = activeHabits.map((habit) => {
          const habitId = String(habit.id);
          const streak = calculateHabitStreak(habitId, parsedData, now);
          if (streak > maxOverallStreak) maxOverallStreak = streak;

          const habitDaysObj = currentMonthRecords[habitId] || {};
          let checkedCount = 0;
          for (let day = 1; day <= currentDayOfMonth; day++) {
            if (habitDaysObj[day] === true || habitDaysObj[day] === "true") {
              checkedCount += 1;
            }
          }

          const pct = currentDayOfMonth > 0
            ? Math.min(100, Math.round((checkedCount / currentDayOfMonth) * 100)) : 0;

          return {
            id: habitId,
            name: habit.name || habit.title || "Unnamed habit",
            icon: habit.icon || habit.emoji || "✅",
            streakValue: streak,
            streak: `${streak} ${streak === 1 ? 'day' : 'days'} streak`,
            pct: `${pct}%`,
          };
        });

        setLongestStreak(`${maxOverallStreak} ${maxOverallStreak === 1 ? 'day' : 'days'}`);

        const sorted = [...habitStats]
          .sort((a, b) => b.streakValue - a.streakValue)
          .map((h, i) => ({ ...h, rank: i + 1 }));
        setTopHabits(sorted);

        Object.entries(currentMonthRecords).forEach(([habitId, habitDaysObj]) => {
          if (activeHabitIds.includes(String(habitId)) && habitDaysObj && typeof habitDaysObj === 'object') {
            for (let day = 1; day <= currentDayOfMonth; day++) {
              const isChecked = habitDaysObj[day];
              if (isChecked === true || isChecked === "true") actualCheckedCount += 1;
            }
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
    return calculateHabitStreak(habitId, allDaysData, new Date());
  };


  return (
    <motion.div
      className="min-h-screen rounded-[28px] border border-[var(--border)] bg-[var(--surface)]/90 p-4 shadow-[0_10px_30px_var(--shadow)] transition-colors sm:p-6 pb-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl font-bold text-[var(--text)]">Analytics</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Track your progress and identify patterns
          </p>
        </motion.div>

        <motion.select
          variants={fadeUp}
          value={range}
          onChange={(e) => setRange(e.target.value)}
          whileHover={{ scale: 1.03 }}
          className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          <option>Last 3 Months</option>
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </motion.select>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 "
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={cardVariant}
            whileHover={{ scale: 1.03, y: -2, transition: { duration: 0.18 } }}
            className="flex cursor-default items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_10px_30px_var(--shadow)]"
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
              <p className="mb-1 text-xs text-[var(--text-muted)]">{s.label}</p>
              <p className="text-xl font-bold leading-tight text-[var(--text)]">
                <AnimatedValue value={s.value} />
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Row */}
      <motion.div
        className="grid gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          {/* Monthly Progress Trend */}
          <motion.div
            variants={cardVariant}
            whileHover={{ scale: 1.01, transition: { duration: 0.18 } }}
            className="rounded-[24px] border border-(--border) bg-(--surface) p-6 shadow-[0_10px_30px_var(--shadow)]"
          >
            <p className="text-sm font-semibold text-(--text)">Monthly Progress Trend</p>
            <p className="mb-4 text-xs text-(--text-muted)">Completion rates over time</p>
            <div className="h-48">
              <SparkLine allDaysData={allDaysData} habitsCount={totalHabits} />
            </div>
          </motion.div>

          {/* Top Performing Habits */}
          <motion.div
            variants={cardVariant}
            whileHover={{ scale: 1.01, transition: { duration: 0.18 } }}
            className="rounded-[24px] border border-(--border) bg-(--surface) p-6 shadow-[0_10px_30px_var(--shadow)]"
          >
            <p className="text-sm font-semibold text-(--text)">Top Performing Habits</p>
            <p className="mb-4 text-xs text-(--text-muted)">This month's best habits</p>

            <AnimatePresence mode="popLayout">
              {topHabits.length === 0 ? (
                <motion.p
                  key="empty"
                  variants={rowVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="pt-2 text-xs text-(--text-muted)"
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
                      className="flex items-center gap-3 border-t border-(--border) py-2.5 first:border-t-0"
                    >
                      {/* Rank badge */}
                      <motion.span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-(--accent-soft) text-xs font-bold text-(--accent)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 16, delay: h.rank * 0.06 }}
                      >
                        {h.rank}
                      </motion.span>

                      {/* Emoji */}
                      <motion.span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--surface-muted) text-lg"
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 18, delay: h.rank * 0.06 + 0.05 }}
                      >
                        {h.icon}
                      </motion.span>

                      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                        <p className="truncate text-xs font-medium text-(--text)">{h.name}</p>
                        <motion.span
                          className="mt-0.5 inline-flex items-center gap-1 rounded-md bg-(--accent-soft) px-2 py-0.5 text-xs font-medium text-(--accent)"
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
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Analytics;