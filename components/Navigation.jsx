import { Link, NavLink } from "react-router-dom";

function Navigation() {
  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200 shadow-md" >
        <div className=" px-6">
          <div className="h-16 flex items-center justify-between p-5">

            {/* Left: Logo + Nav Links */}
            <div className="flex items-center space-x-10">

              {/* Logo */}
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-lg">
                  HabitTracker
                </span>
              </div>

              {/* Navigation Links */}
              <div className="flex gap-4 text-sm text-gray-600">
                <NavLink
                  to="/habits"
                  className={({ isActive }) =>
                    isActive
                      ? "border-b-2 border-indigo-500 font-medium"
                      : "text-gray-600 hover:text-gray-900 "
                  }
                >
                  Habits
                </NavLink>

                <NavLink
                  to="/analytics" className={({ isActive }) =>
                    isActive
                      ? "border-b-2 border-indigo-500 font-medium"
                      : "text-gray-600 hover:text-gray-900 "
                  }
                >
                  Analytics
                </NavLink>

                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    isActive
                      ? "border-b-2 border-indigo-500 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }
                >
                  Settings
                </NavLink>
              </div>
            </div>

            {/* Right: User */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                Welcome
              </span>
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}
export default Navigation;
