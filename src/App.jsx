import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import FullscreenRoboRAVE from "./FullscreenRoboRAVE";
import LiveHeatsByCategory from "./LiveHeatsByCategory";
import Judge from "./Judge";
import JudgeDashboard from "./JudgeDashboard";
import RoboRaveTV from "./RoboRaveTV";

import { fallbackTeams } from "./fallbackTeams";
import LiveScoresContainer from "./LiveScoresContainer";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route 
          path="/" 
          element={<Home />} 
        />

        {/* SCORES (participantes EN VIVO) */}
        <Route
          path="/scores"
          element={
            <FullscreenRoboRAVE>
              <LiveScoresContainer /> {/* ⭐ AQUÍ SE ARREGLA EL LIVE */}
            </FullscreenRoboRAVE>
          }
        />

        {/* JUECES */}
        <Route 
          path="/judge" 
          element={<Judge />} 
        />

        <Route path="/judge/dashboard" element={<JudgeDashboard />} />
        
        <Route path="/tv" element={<RoboRaveTV />} />



      </Routes>

    </BrowserRouter>
  );
}
