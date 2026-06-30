import { NavLink, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();
  
  const links = [
    { to: "/habits", label: "Habits" },
    { to: "/analytics", label: "Analytics" },
    { to: "/settings", label: "Settings" },
  ];

  // Backup fallback evaluation for tracking active path
  const currentActivePath = links.some(l => l.to === location.pathname) 
    ? location.pathname 
    : "/habits";

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

            {/* CSS-Driven Anchor Container */}
            <div className="flex gap-4 text-sm relative py-2">
              
              {links.map((link) => {
                const isActive = currentActivePath === link.to;

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={`relative px-1 pb-1 text-sm transition-colors duration-200 z-10 ${
                      isActive
                        ? "font-medium text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {link.label}

                    {/* Native Chromium-Accelerated Underline CSS Transition */}
                    <span 
                      className={`absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 transform transition-all duration-300 ease-out origin-center ${
                        isActive 
                          ? "scale-x-100 opacity-100" 
                          : "scale-x-0 opacity-0"
                      }`}
                    />
                  </NavLink>
                );
              })}
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