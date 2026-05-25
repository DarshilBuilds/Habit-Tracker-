import React, { useEffect, useState } from 'react'
import AddHabitModal from '.././model/AddHabitModal'

function Habitcard() {
  const [habits, setHabits] = useState([]);
  const [open, setOpen] = useState(false);
  const date = new Date();
  const fullyear  = date.getFullYear();
  const month = new Date().toLocaleDateString(
    "default",
    {
      month:"long"
    }
  );

  useEffect(()=>{
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
  }, []);

  const onCreateHabit = (newHabit) => {
  const updatedHabits = [...habits, newHabit];
  setHabits(updatedHabits);
  localStorage.setItem("habits", JSON.stringify(updatedHabits));
  setOpen(false);
};

  return (
    <>  
      <div className="flex items-center justify-items-center ">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100  p-6">

          {/* <!-- Header --> */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              {/* <!-- Prev button --> */}
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 bg-gray-50 border border-gray-200 font-bold text-base select-none
                       transition-colors duration-150 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200
                       active:scale-95">
                &#8249;
              </button>

              <span className=" flex text-lg font-semibold text-gray-800 tracking-tight gap-2"><div>{month}</div><div>{fullyear}</div></span>
              {/* <!-- Next button --> */}
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 bg-gray-50 border border-gray-200 font-bold text-base select-none
                       transition-colors duration-150 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200
                       active:scale-95">
                &#8250;
              </button>
            </div>

            {/* <!-- Add Habit button --> */}
            <button className="flex items-center gap-2 bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl
                     transition-all duration-200 hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200
                     active:translate-y-0 active:shadow-none active:scale-95 ml-5 cursor-pointer" onClick={() => setOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Habit
            </button>
          </div>

          {/* <!-- Habits or Empty State --> */}
          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              {/* <!-- Icon with animate-pulse --> */}
              <div className="text-gray-300 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.4">
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

              {/* <!-- Add your first habit button --> */}
              <button className="flex items-center gap-2 bg-indigo-500 text-white text-sm font-semibold px-6 py-3 rounded-xl mt-2
                       transition-all duration-200 hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200
                       active:translate-y-0 active:shadow-none active:scale-95 cursor-pointer" onClick={() => setOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add your first habit
              </button>
            </div>
          ) : ( 
            <div className="grid grid-cols-1 gap-4">
              {habits.map((habit) => (
                <div key={habit.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                        {habit.description && <p className="text-sm text-gray-600">{habit.description}</p>}
                        <p className="text-xs text-gray-500 mt-1">{habit.goal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <AddHabitModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onCreateHabit={onCreateHabit}
          />
        </div>
      </div>
    </>
  )
}

export default Habitcard