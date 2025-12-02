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

        // Convertir backend → frontend
        const mapped = json.teams.map(t => {
          const fallback = fallbackTeams.find(f => f.id === t.teamId);

          return {
            id: t.teamId,
            name: fallback?.name || "Unknown",
            category: t.category,
            flag: fallback?.flag || "mx",
            logo: fallback?.logo || "default.png",

            // score principal = points del heat 1
            score: t.heats?.["1"]?.points || 0,

            // guardar heats completos por si los necesitas después
            heats: t.heats || {}
          };
        });

        setTeams(mapped);
      } catch (err) {
        console.error("Error loading scores:", err);
      }
    };

    // Carga inicial
    load();

    // Polling cada 2 segundos
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LiveHeatsByCategory teams={teams} />
  );
}
