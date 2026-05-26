import React, { useEffect, useState } from 'react'
import AddHabitModal from '.././model/AddHabitModal'

function Habitcard() {
  const [habits, setHabits] = useState([]);
  const [open, setOpen] = useState(false);
  const [daysCount, setDaysCount] = useState(0);
  
  // FIXED: Keeps tracking calendars separate for separate habit IDs
  // Structure will be: { [habitId]: { [dayNumber]: true } }
  const [completedays, setcompletedays] = useState({});

  const date = new Date();
  const fullyear = date.getFullYear();
  const month = new Date().toLocaleDateString("default", { month: "long" });

  const getDaysInCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  // 1. FIXED: Added this missing step to compute and set the days count on load!
  useEffect(() => {
    const totalDays = getDaysInCurrentMonth();
    setDaysCount(totalDays);
  }, []);

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

  const onCreateHabit = (newHabit) => {
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    localStorage.setItem("habits", JSON.stringify(updatedHabits));
    setOpen(false);
  };

  // 2. FIXED: Corrected typo name, updated to use localStorage.setItem, and split logs per habit ID
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
  };

  return (
    <>
      <div className="flex items-center justify-center p-6 min-h-screen bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full max-w-4xl">

          {/* <!-- Header --> */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 bg-gray-50 border border-gray-200 font-bold text-base select-none transition-colors duration-150 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 active:scale-95 cursor-pointer">
                ‹
              </button>
              <span className="flex text-lg font-semibold text-gray-800 tracking-tight gap-2">
                <div>{month}</div>
                <div>{fullyear}</div>
              </span>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 bg-gray-50 border border-gray-200 font-bold text-base select-none transition-colors duration-150 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 active:scale-95 cursor-pointer">
                ›
              </button>
            </div>

            <button className="flex items-center gap-2 bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0 active:shadow-none active:scale-95 ml-5 cursor-pointer" onClick={() => setOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Habit
            </button>
          </div>

          {/* <!-- Habits or Empty State --> */}
          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <div className="text-gray-300 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-gray-700 font-semibold text-base">No habits yet</p>
                <p className="text-gray-400 text-sm mt-1">Get started by adding your first habit to track.</p>
              </div>
              <button className="flex items-center gap-2 bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl mt-2 transition-all duration-200 hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0 active:shadow-none active:scale-95 cursor-pointer" onClick={() => setOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add your first habit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {habits.map((habit) => (
                <div key={habit.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-indigo-200 transition-all">
                  
                  {/* FIXED: Restructured layout to stack the calendar neatly under the info header instead of being squished */}
                  <div className="flex flex-col gap-4">
                    
                    {/* Habit Basic Details row */}
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{habit.icon || "🎯"}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{habit.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{habit.goal}</p>
                      </div>
                    </div>

                    {/* Interactive Days Calendar Grid Section */}
                    <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 gap-2 mt-2">
                      {Array.from({ length: daysCount }, (_, i) => {
                        const day = i + 1;
                        
                        // FIXED: Reads individual item completion statuses securely
                        const isDone = completedays[habit.id] && completedays[habit.id][day];

                        return (
                          <button
                            key={day}
                            onClick={() => toggleDay(habit.id, day)} // FIXED: correctly passing parameters to new function
                            className={`p-2 rounded-lg text-center font-bold text-xs transition-all duration-150 active:scale-95 cursor-pointer border flex flex-col items-center justify-center min-w-[42px]
                              ${isDone
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                              }`}
                          >
                            <div className="text-[9px] uppercase tracking-wide opacity-50 font-normal">Day</div>
                            <div className="text-sm mt-0.5">{day}</div>
                          </button>
                        );
                      })}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

          <AddHabitModal
            isOpen1={open}
            onClose={() => setOpen(false)}
            onCreateHabit={onCreateHabit}
          />
        </div>
      </div>
    </>
  )
}

export default Habitcard
