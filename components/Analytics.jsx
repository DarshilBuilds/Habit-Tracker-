import React, { useEffect, useState } from 'react'

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
      iconBg: "bg-indigo-100",
      label: "Active Habits",
      value: totalHabits,
      sub: null,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <polyline points="3 17 9 11 13 15 21 7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="17 7 21 7 21 11" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      iconBg: "bg-green-100",
      label: "Avg. Completion",
      value: avgCompletion,
      sub: null,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <circle cx="12" cy="8" r="4" stroke="#F59E0B" strokeWidth="2" />
          <path d="M8 14h8l1 7H7l1-7z" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
      iconBg: "bg-amber-100",
      label: "Longest Streak",
      value: longestStreak,
      sub: null,
    },
  ];

  useEffect(() => {
    let activeHabits = [];
    let activeHabitIds = [];
    let habitsCount = 0;

    // 1. Get currently active habits list
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
      } catch (error) {
        console.error("Error parsing habits from localStorage:", error);
      }
    }

    // 2. Get tracker completions logs
    const savedData = localStorage.getItem('habit_tracker_days');
    if (savedData && habitsCount > 0) {
      try {
        const parsedData = JSON.parse(savedData);
        let actualCheckedCount = 0;
        let maxOverallStreak = 0;

        const currentDayOfMonth = new Date().getDate();

        // --- PER-HABIT STATS ENGINE (streak + completion %) ---
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
              if (currentStreak > maxHabitStreak) {
                maxHabitStreak = currentStreak;
              }
            } else {
              currentStreak = 0;
            }
          }

          if (maxHabitStreak > maxOverallStreak) {
            maxOverallStreak = maxHabitStreak;
          }

          const pct = currentDayOfMonth > 0
            ? Math.min(100, Math.round((checkedCount / currentDayOfMonth) * 100))
            : 0;

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

        // Sort by streak descending, assign rank
        const sorted = [...habitStats]
          .sort((a, b) => b.streakValue - a.streakValue)
          .map((h, i) => ({ ...h, rank: i + 1 }));

        setTopHabits(sorted);

        // --- AVG COMPLETION ENGINE ---
        Object.entries(parsedData).forEach(([habitId, habitDaysObj]) => {
          if (activeHabitIds.includes(String(habitId)) && habitDaysObj && typeof habitDaysObj === 'object') {
            Object.values(habitDaysObj).forEach((isChecked) => {
              if (isChecked === true || isChecked === "true") {
                actualCheckedCount += 1;
              }
            });
          }
        });

        const totalPossibleCompletions = habitsCount * currentDayOfMonth;
        if (totalPossibleCompletions > 0) {
          const rawPercentage = Math.round((actualCheckedCount / totalPossibleCompletions) * 100);
          setAvgCompletion(`${rawPercentage > 100 ? 100 : rawPercentage}%`);
        } else {
          setAvgCompletion("0%");
        }

      } catch (error) {
        console.error("Error parsing tracker completion stats:", error);
        setAvgCompletion("0%");
        setLongestStreak("0 days");
        setTopHabits([]);
      }
    } else {
      setAvgCompletion("0%");
      setLongestStreak("0 days");
      setTopHabits(
        activeHabits.map((habit, i) => ({
          id: String(habit.id),
          rank: i + 1,
          name: habit.name || habit.title || "Unnamed habit",
          icon: habit.icon || habit.emoji || "✅",
          streakValue: 0,
          streak: "0 days streak",
          pct: "0%",
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
      const today = new Date();
      let streak = 0;
      let checkDay = today.getDate();
      while (checkDay > 0) {
        const val = habitDays[checkDay];
        if (val === true || val === "true") {
          streak++;
          checkDay--;
        } else {
          break;
        }
      }
      return streak;
    } catch {
      return 0;
    }
  };

  function SparkLine() {
    const months = ["Nov 2024", "Dec 2024", "Jan 2025"];
    const w = 600, h = 200, padL = 36, padB = 36, padR = 24, padT = 16;
    const inner_w = w - padL - padR;
    const inner_h = h - padT - padB;
    const yZero = padT + inner_h;
    const points = months.map((_, i) => {
      const x = padL + (i / (months.length - 1)) * inner_w;
      return `${x},${yZero}`;
    });

    return (
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" display="block">
        {[0, 1].map((tick) => {
          const y = padT + inner_h - tick * inner_h;
          return (
            <g key={tick}>
              <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#E5E7EB" strokeWidth="1" />
              <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#9CA3AF">{tick}</text>
            </g>
          );
        })}
        <polyline points={points.join(" ")} fill="none" stroke="#7C6FF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {months.map((m, i) => {
          const x = padL + (i / (months.length - 1)) * inner_w;
          return (
            <text key={m} x={x} y={h - 8} textAnchor="middle" fontSize="11" fill="#9CA3AF">{m}</text>
          );
        })}
      </svg>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your progress and identify patterns</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option>Last 3 Months</option>
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className="text-xl font-bold text-gray-900 leading-tight">{s.value}</p>
              {s.sub && <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1.9fr 1fr" }}>
        {/* Monthly Progress Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Monthly Progress Trend</p>
          <p className="text-xs text-gray-500 mb-4">Completion rates over time</p>
          <div className="h-48">
            <SparkLine />
          </div>
        </div>

        {/* Top Performing Habits */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Top Performing Habits</p>
          <p className="text-xs text-gray-500 mb-4">This month's best habits</p>

          {topHabits.length === 0 ? (
            <p className="text-xs text-gray-400 pt-2">No habits found.</p>
          ) : (
            topHabits.map((h) => (
              <div key={h.id} className="flex items-center gap-3 py-2.5 border-t border-gray-100">
                <span className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-500 shrink-0">
                  {h.rank}
                </span>
                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">
                  {h.icon}
                </span>
                <div className="flex min-w-0 align-center justify-between gap-2">
                  <p className="text-xs font-medium text-gray-900 truncate">{h.name}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
                    🔥 {calculateStreak(h.id)} day streak
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;