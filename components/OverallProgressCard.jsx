import { useEffect, useState } from "react";

function OverallProgressCard() {
  const [habits, setHabits] = useState([]);
  const [completedays, setcompletedays] = useState({});

  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
  }, []);

  useEffect(() => {
    const savedata = localStorage.getItem('habit_tracker_days');
    if (savedata) {
      setcompletedays(JSON.parse(savedata));
    }
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

      <div className="w-fit min-w-[320px] max-w-xl p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}

        {/* Card Header */}
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-gray-700">
            bar_chart
          </span>
          <h3 className="font-semibold text-gray-900 mb-5">
            Overall Progress
          </h3>
        </div>
        -
        {/* 2. THE STACKING ROW CONTAINER */}
        <div className="flex flex-col divide-y divide-gray-100">

          {/* Handle empty list inside the card */}
          {habits.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">
              No habits listed yet.
            </p>
          ) : (
            /* 3. MAP HABITS INTO VERTICAL ROWS */
            habits.map((habit) => (
              <div
                key={habit.id || habit.name}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 gap-8"
              >
                {/* Left Side: Habit Details */}
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-700 capitalize">
                    {habit.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {habit.category || 'Routine'}
                  </span>
                </div>

                {/* Right Side: Status/Metrics */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    🔥 {calculateStreak(habit.id || habit.name)} day streak
                  </span>
                </div>
              </div>
            ))
          )}

        </div>
      </div>

  );
}

export default OverallProgressCard;
