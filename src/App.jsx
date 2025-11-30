import FullscreenRoboRAVE from "./FullscreenRoboRAVE";
import LiveHeatsByCategory from "./LiveHeatsByCategory";
import { fallbackTeams } from "./fallbackTeams";

export default function App() {
  return (
    <FullscreenRoboRAVE>
      <h1 style={{ marginBottom: "20px", color: "white" }}>
        Live Score
      </h1>

      {/* Aquí se ve tu versión PREMIUM por categorías */}
      <LiveHeatsByCategory teams={fallbackTeams} />
    </FullscreenRoboRAVE>
  );
}
