import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

function MainLayout() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--bg)] px-4 py-6 text-[var(--text)] transition-colors sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default MainLayout;
