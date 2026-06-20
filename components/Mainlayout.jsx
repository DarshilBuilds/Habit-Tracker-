import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

function MainLayout() {
  return (
    <>
    <Navigation />
      <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
