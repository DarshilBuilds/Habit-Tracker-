import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/Mainlayout";
import Habits from "../components/Habits";
import Analytics from "../components/Analytics";
import Settings from "../components/setting";

function App() {
  return (
    
    <Routes>
      {/* Layout */}
      <Route path="/" element={<MainLayout />}>

        {/* DEFAULT PAGE */}
        <Route index element={<Habits />} />

        {/* OTHER PAGES */}
        <Route path="habits" element={<Habits />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />

      </Route>

    </Routes>
  );
}

export default App;
