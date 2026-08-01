import { NavLink, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();

  const links = [
    { to: "/habits", label: "Habits" },
    { to: "/analytics", label: "Analytics" },
    { to: "/settings", label: "Settings" },
  ];

  const normalizedPath = location.pathname === "/" ? "/habits" : location.pathname;
  const currentActivePath = links.some((l) => l.to === normalizedPath)
    ? normalizedPath
    : "/habits";

  return (
    <nav
      className="w-full border-b transition-colors"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", boxShadow: "0 10px 30px var(--shadow)" }}
    >
      <div className="px-6">
        <div className="flex h-16 items-center justify-between p-5">
          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-[var(--text)]">HabitTracker</span>
            </div>

            <div className="relative flex gap-4 py-2 text-sm">
              {links.map((link) => {
                const isActive = currentActivePath === link.to;

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={`relative z-10 px-1 pb-1 text-sm transition-colors duration-200 ${
                      isActive
                        ? "font-medium text-[var(--text)]"
                        : "text-[var(--text-muted)] hover:text-[var(--accent)]"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 origin-center transform transition-all duration-300 ease-out ${
                        isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                      }`}
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-[var(--text-muted)]">Welcome</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;