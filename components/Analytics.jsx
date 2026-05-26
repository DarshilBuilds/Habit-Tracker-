import React, { useState, useEffect } from 'react';

function Analytics() {
  const [daysCount, setDaysCount] = useState(0);
  const [monthName, setMonthName] = useState('');
  
  // State to hold completed days: e.g., { 1: true, 5: true }
  const [completedDays, setCompletedDays] = useState({});

  // 1. Calculate days in the current month on component mount
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // Get total days in this month
    const totalDays = new Date(year, month + 1, 0).getDate();
    setDaysCount(totalDays);

    // Get current month name text
    const name = today.toLocaleString('default', { month: 'long' });
    setMonthName(name);

    // 2. Load previously saved checkmarks from the hard drive
    const savedData = localStorage.getItem('habit_tracker_days');
    if (savedData) {
      setCompletedDays(JSON.parse(savedData));
    }
  }, []);

  // 3. Handle what happens when a user clicks a day square
  const toggleDay = (dayNumber) => {
    // Copy old state and flip the true/false value for the clicked day
    const updatedDays = {
      ...completedDays,
      [dayNumber]: !completedDays[dayNumber]
    };

    // Update the visual UI state
    setCompletedDays(updatedDays);

    // Save the updated object to the local disk file instantly
    localStorage.setItem('habit_tracker_days', JSON.stringify(updatedDays));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">🏃‍♂️ Daily Routine Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Click a square to log completion for {monthName}</p>
        </div>
        <div className="text-xs bg-gray-100 px-3 py-1.5 rounded-full font-semibold text-gray-600">
          Local Storage Active
        </div>
      </div>

      {/* 4. The Interactive 7-Column Grid Layout */}
      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: daysCount }, (_, i) => {
          const day = i + 1;
          const isDone = completedDays[day]; // Check if this day is marked true

          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`p-4  rounded-xl text-center font-bold text-sm transition-all duration-200 transform active:scale-95 cursor-pointer border
                ${isDone 
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-200 hover:bg-emerald-600' 
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
            >
              {/* <div className="text-xs opacity-60 font-medium mb-1">Day</div> */}
              {/* <div className="text-lg">{day}</div> */}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Analytics;