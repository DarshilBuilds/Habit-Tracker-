import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// Animated counter hook
function useCountUp(target, duration = 800) {
    const [display, setDisplay] = useState(0);
    const prev = useRef(0);

    useEffect(() => {
        const start = prev.current;
        const diff = target - start;
        if (diff === 0) return;

        const startTime = performance.now();
        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setDisplay(Math.round(start + diff * eased));
            if (progress < 1) requestAnimationFrame(tick);
            else prev.current = target;
        };
        requestAnimationFrame(tick);
    }, [target, duration]);

    return display;
}

// Stat card with count-up
function StatCard({ value, label, colorClass, textColor, suffix = "", delay = 0 }) {
    const counted = useCountUp(value);
    return (
        <motion.div
            className={`${colorClass} p-4 rounded-xl flex flex-col justify-center`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.35, type: "spring", stiffness: 280, damping: 22 }}
            whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
        >
            <span className={`text-2xl font-bold ${textColor} leading-tight`}>
                {counted}{suffix}
            </span>
            <span className={`text-xs ${textColor.replace('700', '600').replace('300', '400')} mt-1 font-medium`}>
                {label}
            </span>
        </motion.div>
    );
}

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } }
};

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
};

function Dailyprogessgraph() {
    const now = new Date();
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    const [habitData, setHabitData] = useState(Array(totalDaysInMonth).fill(0));
    const [maxHabitsCount, setMaxHabitsCount] = useState(4);
    const [totalCompleted, setTotalCompleted] = useState(0);
    const [averageRate, setAverageRate] = useState(0);
    const [bestDay, setBestDay] = useState(0);
    const [activeDays, setActiveDays] = useState(0);
    const [chartReady, setChartReady] = useState(false);

    const fullyear = now.getFullYear();
    const month = now.toLocaleDateString("default", { month: "long" });
    const labels = Array.from({ length: totalDaysInMonth }, (_, i) => String(i + 1).padStart(2, '0'));

    useEffect(() => {
        const updateCalculatedMetrics = () => {
            let activeHabitIds = [];

            const storedHabits = localStorage.getItem('habits');
            if (storedHabits) {
                try {
                    const parsedHabits = JSON.parse(storedHabits);
                    if (Array.isArray(parsedHabits)) {
                        activeHabitIds = parsedHabits.map(h => String(h.id));
                        setMaxHabitsCount(parsedHabits.length > 0 ? parsedHabits.length : 1);
                    }
                } catch (e) { console.error("Error parsing habits list:", e); }
            }

            const savedData = localStorage.getItem('habit_tracker_days');
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    const monthlyCounts = Array(totalDaysInMonth).fill(0);

                    Object.entries(parsedData).forEach(([habitId, habitDaysObj]) => {
                        if (activeHabitIds.includes(String(habitId)) && habitDaysObj && typeof habitDaysObj === 'object') {
                            Object.entries(habitDaysObj).forEach(([dayStr, isChecked]) => {
                                const dayNum = parseInt(dayStr, 10);
                                if ((isChecked === true || isChecked === "true") && dayNum >= 1 && dayNum <= totalDaysInMonth) {
                                    monthlyCounts[dayNum - 1] += 1;
                                }
                            });
                        }
                    });

                    setHabitData(monthlyCounts);

                    const total = monthlyCounts.reduce((sum, val) => sum + val, 0);
                    setTotalCompleted(total);

                    const active = monthlyCounts.filter(val => val > 0).length;
                    setActiveDays(active);

                    const highest = Math.max(...monthlyCounts);
                    setBestDay(highest > 0 ? highest : 0);

                    const currentDayOfMonth = new Date().getDate();
                    const totalPossibleChecks = activeHabitIds.length * currentDayOfMonth;
                    const avg = total > 0 && totalPossibleChecks > 0
                        ? Math.round((total / totalPossibleChecks) * 100)
                        : 0;
                    setAverageRate(avg > 100 ? 100 : avg);

                } catch (error) { console.error("Error parsing tracker data:", error); }
            } else {
                setHabitData(Array(totalDaysInMonth).fill(0));
                setTotalCompleted(0); setActiveDays(0); setBestDay(0); setAverageRate(0);
            }

            // Slight delay so chart animates in after data is ready
            setTimeout(() => setChartReady(true), 100);
        };

        updateCalculatedMetrics();
        window.addEventListener('storage', updateCalculatedMetrics);
        window.addEventListener('load', updateCalculatedMetrics);
        return () => {
            window.removeEventListener('storage', updateCalculatedMetrics);
            window.removeEventListener('load', updateCalculatedMetrics);
        };
    }, [totalDaysInMonth]);

    const data = {
        labels,
        datasets: [{
            label: 'Habits Completed',
            data: habitData,
            borderColor: '#6366f1',
            backgroundColor: '#6366f1',
            borderWidth: 2,
            pointBackgroundColor: '#6366f1',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 900,
            easing: 'easeInOutQuart',
        },
        plugins: { legend: { display: false } },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af', font: { size: 10 } },
            },
            y: {
                min: 0,
                max: Math.max(maxHabitsCount, Math.max(...habitData) + 2),
                ticks: {
                    stepSize: Math.max(...habitData) > 5 ? undefined : 1,
                    precision: 0,
                    color: '#9ca3af',
                    font: { size: 10 }
                },
                grid: { color: '#f3f4f6' },
            },
        },
    };

    return (
        <motion.div
            className="p-6 flex flex-col gap-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm rounded-xl w-full max-w-4xl transition-colors"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
        >
            {/* Header */}
            <motion.div
                className="flex flex-col gap-1"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="flex items-center gap-2" variants={fadeUp}>
                    <motion.span
                        className="material-symbols-outlined text-gray-700 dark:text-gray-300"
                        initial={{ rotate: -15, scale: 0.6 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                    >
                        bar_chart
                    </motion.span>
                    <span className="text-base font-bold text-gray-800 dark:text-white">Daily Progress</span>
                </motion.div>

                <motion.p className="text-xs text-gray-500 dark:text-gray-400 pl-8" variants={fadeUp}>
                    Track how many habits you complete each day this {month} {fullyear}
                </motion.p>
            </motion.div>

            {/* Chart */}
            <AnimatePresence>
                {chartReady && (
                    <motion.div
                        className="h-64 w-full relative"
                        initial={{ opacity: 0, scaleY: 0.85 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{ transformOrigin: "bottom" }}
                    >
                        <Line data={data} options={options} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard
                    value={totalCompleted}
                    label="Total Completed"
                    colorClass="bg-indigo-50 dark:bg-indigo-900/30"
                    textColor="text-indigo-700 dark:text-indigo-300"
                    delay={0.2}
                />
                <StatCard
                    value={averageRate}
                    label="Average Rate"
                    colorClass="bg-emerald-50 dark:bg-emerald-900/30"
                    textColor="text-emerald-700 dark:text-emerald-300"
                    suffix="%"
                    delay={0.28}
                />
                <StatCard
                    value={bestDay}
                    label="Best Day"
                    colorClass="bg-purple-50 dark:bg-purple-900/30"
                    textColor="text-purple-700 dark:text-purple-300"
                    delay={0.36}
                />
                <StatCard
                    value={activeDays}
                    label="Active Days"
                    colorClass="bg-orange-50 dark:bg-orange-900/30"
                    textColor="text-orange-700 dark:text-orange-300"
                    delay={0.44}
                />
            </div>
        </motion.div>
    );
}

export default Dailyprogessgraph;