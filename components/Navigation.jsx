import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-md transition-colors">
      <div className="px-6">
        <div className="h-16 flex items-center justify-between p-5">
          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg text-gray-900 dark:text-white">
                HabitTracker
              </span>
            </div>

            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300">
              <NavLink
                to="/habits"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-indigo-500 font-medium text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }
              >
                Habits
              </NavLink>

              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-indigo-500 font-medium text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }
              >
                Analytics
              </NavLink>

              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-indigo-500 font-medium text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }
              >
                Settings
              </NavLink>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">Welcome</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navigation;