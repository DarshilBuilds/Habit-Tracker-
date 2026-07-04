import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/Mainlayout";
import Habits from "../components/Habits";
import Analytics from "../components/Analytics";
import Settings from "../components/Setting";
import { ThemeProvider } from "../components/ThemeContext";
import { MotionConfig } from "framer-motion";

function App() {
  return (
    <MotionConfig reducedMotion={false}>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Habits />} />
            <Route path="habits" element={<Habits />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </MotionConfig>
  );
}

export default App;
