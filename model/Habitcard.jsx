import React, { useEffect, useState, useRef } from 'react' // 1. Added useRef here
import AddHabitModal from './AddHabitModal'

function Habitcard(){
  const [habits, setHabits] = useState([]);
  const [open, setOpen] = useState(false);
  const [daysCount, setDaysCount] = useState(0);
  const [completedays, setcompletedays] = useState({});

  // 2. CREATE SCROLL REFERENCES
  const headerScrollRef = useRef(null);
  const rowRefs = useRef([]); // Stores references for all habit rows

  const date = new Date();
  const fullyear = date.getFullYear();
  const month = new Date().toLocaleDateString("default", { month: "long" });

  const getDaysInCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  useEffect(() => {
    setDaysCount(getDaysInCurrentMonth());
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
    window.location.reload() // Force reload to update the UI immediately after toggling a day
    setcompletedays(updatedays);
    localStorage.setItem('habit_tracker_days', JSON.stringify(updatedays));
  };
   

  // 3. MASTER SYNCHRONIZATION FUNCTION
  const handleScroll = (scrolledElement) => {
    const scrollLeftPosition = scrolledElement.scrollLeft;

    // Sync the top header if it wasn't the source of the scroll event
    if (headerScrollRef.current && headerScrollRef.current !== scrolledElement) {
      headerScrollRef.current.scrollLeft = scrollLeftPosition;
    }

    // Sync every single habit grid row on the screen instantly
    rowRefs.current.forEach((row) => {
      if (row && row !== scrolledElement) {
        row.scrollLeft = scrollLeftPosition;
      }
    });
  };
  

  return (
    <div className=" min-h-screenflex items-center justify-center ">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-full max-w-4xl overflow-hidden p-6 transition-colors">

        {/* Top Navigation Panel Header */}
        <div className="flex  items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition active:scale-95 cursor-pointer">‹</button>
            <span className="text-base font-bold text-gray-800 dark:text-white tracking-tight flex gap-1">
              {month} {fullyear}
            </span>
            <button className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition active:scale-95 cursor-pointer">›</button>
          </div>
          <button onClick={() => setOpen(true)} className="bg-indigo-600 text-white text-xs font-bold px-6 py-2 rounded-lg hover:bg-indigo-700 transition active:scale-95 cursor-pointer">
            + Add Habit
          </button>
        </div>

        {/* Master Table Grid Area */}
        <div className="flex flex-col">

          {/* 4. ATTACH REF TO DAYS HEADER & HIDE SCROLLBAR */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 text-xs font-bold text-gray-400 dark:text-gray-500">
            <div className="w-64 p-4 shrink-0 text-left border-r border-gray-200 dark:border-gray-700 pl-6">
              Habit
            </div>

            {/* Added ref, onScroll listener, and 'scrollbar-none' to hide the bar */}
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
          </div>

          {/* DYNAMIC ROW RENDER LAYOUT */}
          {habits.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500 font-medium">
              No habits created yet. Click "+ Add Habit" to start tracking!
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {habits.map((habit, index) => (
                <div key={habit.id} className="flex items-center hover:bg-gray-50/30 dark:hover:bg-gray-700/30 transition-colors">
                  {/* 1. Added "group" and changed to "justify-between" to spread items out */}
                  <div className="w-64 p-4 shrink-0 flex items-center justify-between gap-3 border-r border-gray-200 dark:border-gray-700 pl-6 group">

                    {/* Left container for Icon + Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0">{habit.icon || "📝"}</span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
                        {habit.name}
                      </span>
                    </div>

                    <span
                      className="material-symbols-outlined cursor-pointer text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 ml-auto"
                      onClick={() => handleDeleteClick(habit.id)}
                    >
                      delete
                    </span>
                  </div>



                  {/* 5. ATTACH REFS TO EACH HABIT ROW TRACKER */}
                  <div
                    ref={(el) => (rowRefs.current[index] = el)}
                    onScroll={(e) => handleScroll(e.currentTarget)}
                    className="flex-1 flex overflow-x-auto scrollbar-thin divide-x divide-gray-100 dark:divide-gray-700"
                  >
                    {Array.from({ length: daysCount }, (_, i) => {
                      const day = i + 1;
                      const isDone = completedays[habit.id] && completedays[habit.id][day];

                      return (
                        <div key={day} className="min-w-[48px] p-3 flex items-center justify-center">
                          <button
                            onClick={() => toggleDay(habit.id, day)}
                            className={`w-6 h-6 rounded border transition-all transform active:scale-90 cursor-pointer flex items-center justify-center
                              ${isDone
                                ? 'bg-emerald-500 border-emerald-600 shadow-sm text-white'
                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400'
                              }`}
                          >
                            {isDone && (
                              <svg xmlns="http://w3.org" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      <AddHabitModal isOpen={open} onClose={() => setOpen(false)} onCreateHabit={onCreateHabit} />
    </div>
  )
}

export default Habitcard;