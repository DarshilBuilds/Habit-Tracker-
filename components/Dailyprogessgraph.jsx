import React, { useState, useEffect } from 'react';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

function Dailyprogessgraph() {
    const now = new Date();
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    const [habitData, setHabitData] = useState(Array(totalDaysInMonth).fill(0));
    const [maxHabitsCount, setMaxHabitsCount] = useState(4); 

    const [totalCompleted, setTotalCompleted] = useState(0);
    const [averageRate, setAverageRate] = useState(0);
    const [bestDay, setBestDay] = useState(0);
    const [activeDays, setActiveDays] = useState(0);

    const fullyear = now.getFullYear();
    const month = now.toLocaleDateString("default", { month: "long" });
    const labels = Array.from({ length: totalDaysInMonth }, (_, i) => String(i + 1).padStart(2, '0'));

    useEffect(() => {
        const updateCalculatedMetrics = () => {
            let activeHabitIds = [];

            // 1. Fetch only current valid active habits from list
            const storedHabits = localStorage.getItem('habits');
            if (storedHabits) {
                try {
                    const parsedHabits = JSON.parse(storedHabits);
                    if (Array.isArray(parsedHabits)) {
                        // Extract IDs and make sure they are strings for clean checking
                        activeHabitIds = parsedHabits.map(h => String(h.id));
                        setMaxHabitsCount(parsedHabits.length > 0 ? parsedHabits.length : 1);
                    }
                } catch (e) {
                    console.error("Error parsing habits list:", e);
                }
            }

            // 2. Fetch daily checkmark completions map
            const savedData = localStorage.getItem('habit_tracker_days');

            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData); 
                    const monthlyCounts = Array(totalDaysInMonth).fill(0);

                    // 3. Strict verification matching active habit tracking keys
                    Object.entries(parsedData).forEach(([habitId, habitDaysObj]) => {
                        // Convert to string to ensure a perfect match with active ids
                        if (activeHabitIds.includes(String(habitId)) && habitDaysObj && typeof habitDaysObj === 'object') {
                            Object.entries(habitDaysObj).forEach(([dayStr, isChecked]) => {
                                const dayNum = parseInt(dayStr, 10);

                                // FIX: Check if value is truly truthy (handles true vs "true")
                                if ((isChecked === true || isChecked === "true") && dayNum >= 1 && dayNum <= totalDaysInMonth) {
                                    monthlyCounts[dayNum - 1] += 1;
                                }
                            });
                        }
                    });

                    setHabitData(monthlyCounts);

                    // --- ACCURATE METRICS CALCULATION ENGINE ---
                    const total = monthlyCounts.reduce((sum, val) => sum + val, 0);
                    setTotalCompleted(total);

                    const active = monthlyCounts.filter(val => val > 0).length;
                    setActiveDays(active);

                    const highest = Math.max(...monthlyCounts);
                    setBestDay(highest > 0 ? highest : 0);

                    // Average Rate calculation based on entries up to today's date
                    const currentDayOfMonth = new Date().getDate();
                    const totalPossibleChecks = activeHabitIds.length * currentDayOfMonth;
                    const avg = total > 0 && totalPossibleChecks > 0 
                        ? Math.round((total / totalPossibleChecks) * 100) 
                        : 0;
                    
                    setAverageRate(avg > 100 ? 100 : avg);

                } catch (error) {
                    console.error("Error parsing tracker data:", error);
                }
            } else {
                setHabitData(Array(totalDaysInMonth).fill(0));
                setTotalCompleted(0);
                setActiveDays(0);
                setBestDay(0);
                setAverageRate(0);
            }
        };

        // Run immediately when component mounts
        updateCalculatedMetrics();

        // Listen for storage events across tabs or reloads
        window.addEventListener('storage', updateCalculatedMetrics);
        window.addEventListener('load', updateCalculatedMetrics);

        return () => {
            window.removeEventListener('storage', updateCalculatedMetrics);
            window.removeEventListener('load', updateCalculatedMetrics);
        };
    }, [totalDaysInMonth]);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Habits Completed',
                data: habitData,
                borderColor: '#6366f1',
                backgroundColor: '#6366f1',
                borderWidth: 2,
                pointBackgroundColor: '#6366f1',
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0,
            },
        ],
    };

   const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#9ca3af', font: { size: 10 } },
        },
        y: {
            min: 0,
            // 1. dynamic ceiling: adds padding above your highest completed habit day
            max: Math.max(maxHabitsCount, Math.max(...habitData) + 2), 
            ticks: { 
                // 2. auto-step size: handles clean numbers if values go up to 10+
                stepSize: Math.max(...habitData) > 5 ? undefined : 1, 
                precision: 0, // Forces whole integers only (no 1.5, 2.5)
                color: '#9ca3af', 
                font: { size: 10 } 
            },
            grid: { color: '#f3f4f6' },
        },
    },
};  
    return (
        <div className="p-6 flex flex-col gap-6 border border-gray-200 bg-white shadow-sm rounded-xl w-full max-w-4xl">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-700">bar_chart</span>
                    <span className="text-base font-bold text-gray-800">Daily Progress</span>
                </div>
                <p className="text-xs text-gray-500 pl-8">
                    Track how many habits you complete each day this {month} {fullyear}
                </p>
            </div>

            <div className="h-64 w-full relative">
                <Line data={data} options={options} />
            </div>

            {/* Bottom Status Grid Display */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-indigo-50 p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-2xl font-bold text-indigo-700 leading-tight">{totalCompleted}</span>
                    <span className="text-xs text-indigo-600 mt-1 font-medium">Total Completed</span>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-2xl font-bold text-emerald-700 leading-tight">{averageRate}%</span>
                    <span className="text-xs text-emerald-600 mt-1 font-medium">Average Rate</span>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-2xl font-bold text-purple-700 leading-tight">{bestDay}</span>
                    <span className="text-xs text-purple-600 mt-1 font-medium">Best Day</span>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-2xl font-bold text-orange-700 leading-tight">{activeDays}</span>
                    <span className="text-xs text-orange-600 mt-1 font-medium">Active Days</span>
                </div>
            </div>
        </div>
    );
}

export default Dailyprogessgraph;
