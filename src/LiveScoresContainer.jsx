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

        // backend solo tiene equipos puntuados
        const scored = json.teams;

        // combinar fallback + scores reales
        const merged = fallbackTeams.map(f => {
          const match = scored.find(s => s.teamId === f.id);

          return {
            id: f.id,
            name: f.name,
            logo: f.logo,
            flag: f.flag,
            category: f.category,

            // score real → si existe
            score: match?.heats?.["1"]?.points || 0,

            // heats reales
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
