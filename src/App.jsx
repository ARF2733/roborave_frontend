import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import FullscreenRoboRAVE from "./FullscreenRoboRAVE";
import LiveHeatsByCategory from "./LiveHeatsByCategory";
import Judge from "./Judge";
import JudgeDashboard from "./JudgeDashboard";
import Sponsor from "./Sponsor";
import { fallbackTeams } from "./fallbackTeams";
import LiveScoresContainer from "./LiveScoresContainer"; // ⭐ NUEVO

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

        {/* SPONSORS */}
        <Route 
          path="/sponsor" 
          element={<Sponsor />} 
        />

      </Routes>

    </BrowserRouter>
  );
}
