import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import FullscreenRoboRAVE from "./FullscreenRoboRAVE";
import LiveScoresContainer from "./LiveScoresContainer";

import Judge from "./Judge";
import JudgeSelect from "./JudgeSelect";
import JudgeAmazeDashboard from "./JudgeAmazeDashboard";
import JudgeDashboard from "./JudgeDashboard";
import JudgePrelims from "./JudgePrelims";

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

        {/* DASHBOARD GENÉRICO (se irá eliminando pronto) */}
        <Route path="/judge/dashboard" element={<JudgeDashboard />} />

        {/* PRELIMS TEMPORAL (Sumo/Amaze se separarán) */}
        <Route path="/judge/prelims" element={<JudgePrelims />} />

        {/* FUTURAS RUTAS (no existen aún, pero quedan preparadas) */}
        {/* <Route path="/judge/amaze/prelims" element={<AmazePrelims />} /> */}
        {/* <Route path="/judge/amaze/finals" element={<AmazeFinals />} /> */}
        {/* <Route path="/judge/sumobot/prelims" element={<SumoPrelims />} /> */}
        {/* <Route path="/judge/sumobot/finals" element={<SumoFinals />} /> */}

        {/* ROBO RAVE TV */}
        <Route path="/tv" element={<RoboRaveTV />} />

        {/* FINALES GLOBAL */}
        <Route path="/finals" element={<Finals />} />





      </Routes>

    </BrowserRouter>
  );


}


