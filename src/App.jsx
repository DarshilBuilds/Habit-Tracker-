import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/Mainlayout";
import Habits from "../components/Habits";
import Analytics from "../components/Analytics";
import Settings from "../components/Setting";
import { ThemeProvider } from "../components/ThemeContext";
import { useReducedMotion } from "framer-motion";

function App() {
  const prefersReducedMotion = useReducedMotion();
  // If Electron is forcing reduced motion, animations become reduced/disabled.
  // Force animations on by treating reduced motion as false.
  const forceAnimations = true;

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            index
            element={<Habits forceAnimations={forceAnimations && prefersReducedMotion} />}
          />
          <Route
            path="habits"
            element={<Habits forceAnimations={forceAnimations && prefersReducedMotion} />}
          />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
