import FullscreenRoboRAVE from "./FullscreenRoboRAVE";
import LiveHeatsByCategory from "./LiveHeatsByCategory";
import { fallbackTeams } from "./fallbackTeams";

export default function App() {
  return (
    <FullscreenRoboRAVE>
      

      {/* Aquí se ve tu versión PREMIUM por categorías */}
      <LiveHeatsByCategory teams={fallbackTeams} />
    </FullscreenRoboRAVE>
  );
}
