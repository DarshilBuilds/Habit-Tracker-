import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

function MainLayout() {
  return (
    <>
    <Navigation />
      <main className="p-6  bg-gray-100">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
