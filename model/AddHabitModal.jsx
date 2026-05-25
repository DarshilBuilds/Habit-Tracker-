import { useState } from "react";

function AddHabitModal({ isOpen, onClose, onCreateHabit }) {
  const [isIconOpen, setIconOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("📄");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("Once daily");
  const [allMonths, setAllMonths] = useState(true);

  if (!isOpen) return null;

  const icons = [
    "🏃‍♂️", "📚", "💧", "🍎", "🎵", "🎯",
    "📄", "☕", "💻", "🌙", "🏋️‍♂️", "🧘‍♂️",
    "📖", "🚶‍♂️", "🍵", "📝", "🔥", "✅"
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHabit = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      icon: selectedIcon,
      goal,
      allMonths,
      completedDates: []
    };

    onCreateHabit(newHabit);

    setName("");
    setDescription("");
    setSelectedIcon("📄");
    setGoal("Once daily");
    setAllMonths(true);
    onClose();

  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-gray-900">
          Add New Habit
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Create a new habit to track daily.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink 8 glasses of water"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows="3"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>

            <button
              type="button"
              onClick={() => setIconOpen(!isIconOpen)}
              className="flex items-center justify-between w-24 border rounded-md px-3 py-2 cursor-pointer"
            >
              <span className="text-xl">{selectedIcon}</span>
              <span className="material-symbols-outlined">
                keyboard_arrow_down
              </span>
            </button>

            {isIconOpen && (
              <div className="absolute mt-2 z-10 bg-white border rounded-lg p-3 grid grid-cols-6 gap-3 shadow-lg">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className="text-xl hover:bg-gray-100 rounded-md p-1 cursor-pointer"
                    onClick={() => {
                      setSelectedIcon(icon);
                      setIconOpen(false);
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={allMonths}
              onChange={(e) => setAllMonths(e.target.checked)}
              className="mt-1"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                All months (default)
              </p>
              <p className="text-xs text-gray-500">
                This habit will appear in all months
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option>Once daily</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md cursor-pointer"
          >
            Create Habit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddHabitModal;