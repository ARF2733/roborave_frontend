import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import FullscreenRoboRAVE from "./FullscreenRoboRAVE";
import LiveScoresContainer from "./LiveScoresContainer";

import Judge from "./Judge";
import JudgeSelect from "./JudgeSelect";
import JudgeAmazeDashboard from "./JudgeAmazeDashboard";
import JudgeAmazePrelims from "./JudgeAmazePrelims";
import JudgeAmazeFinals from "./JudgeAmazeFinals";
import JudgeSumoDashboard from "./JudgeSumoDashboard";
import JudgeSumoPrelims from "./JudgeSumoPrelims";
import JudgeSumoFinals from "./JudgeSumoFinals";



import RoboRaveTV from "./RoboRaveTV";
import Finals from "./Finals";




export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* SCORES (vista pública en vivo) */}
        <Route
          path="/scores"
          element={
            <FullscreenRoboRAVE>
              <LiveScoresContainer />
            </FullscreenRoboRAVE>
          }
        />

        {/* JUECES — LOGIN */}
        <Route path="/judge" element={<Judge />} />

        {/* NUEVA PANTALLA DE SELECCIÓN */}
        <Route path="/judge/select" element={<JudgeSelect />} />
        <Route path="/judge/amaze" element={<JudgeAmazeDashboard />} />
        <Route path="/judge/amaze/prelims" element={<JudgeAmazePrelims />} />
        <Route path="/judge/amaze/finals" element={<JudgeAmazeFinals />} />
        <Route path="/judge/sumobot" element={<JudgeSumoDashboard />} />
        <Route path="/judge/sumo/prelims" element={<JudgeSumoPrelims />} />
        <Route path="/judge/sumo/finals" element={<JudgeSumoFinals />} />

        {/* ROBO RAVE TV */}
        <Route path="/tv" element={<RoboRaveTV />} />

        {/* FINALES GLOBAL */}
        <Route path="/finals" element={<Finals />} />





      </Routes>

    </BrowserRouter>
  );


}


