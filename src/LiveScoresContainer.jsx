import { useEffect, useState } from "react";
import LiveHeatsByCategory from "./LiveHeatsByCategory";
import { fallbackTeams } from "./fallbackTeams";

export default function LiveScoresContainer() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("https://roborave.onrender.com/api/scores");
        const json = await r.json();

        const scored = json.teams;

        const merged = fallbackTeams.map(f => {
          const match = scored.find(s => s.teamId === f.id);

          // <-- SUMAR TODOS LOS HEATS
          const totalPoints = Object.values(match?.heats || {}).reduce(
            (sum, h) => sum + (h.points || 0),
            0
          );

          return {
            id: f.id,
            name: f.name,
            logo: f.logo,
            flag: f.flag,
            category: f.category,

            // <-- ahora muestra el total correcto
            score: totalPoints,

            heats: match?.heats || {}
          };
        });

        setTeams(merged);

      } catch (err) {
        console.error("Error loading live scores:", err);
      }
    };

    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  return <LiveHeatsByCategory teams={teams} />;
}
