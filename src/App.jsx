import { useEffect, useState } from "react";

function App() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // URL del backend de Render
    const URL = "https://roborave.onrender.com/api/scores";

    const loadScores = async () => {
      try {
        const r = await fetch(URL);
        const json = await r.json();
        setTeams(json.teams || []);
      } catch (err) {
        console.error("Error cargando puntajes:", err);
      }
    };

    loadScores();                 // cargar una vez
    const interval = setInterval(loadScores, 2000); // actualizar cada 2s

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 32, fontFamily: "Arial" }}>
      <h1>🔥 RoboRAVE Live Scores</h1>
      <ul style={{ fontSize: 22 }}>
        {teams.map((t) => (
          <li key={t.id} style={{ marginBottom: 12 }}>
            {t.name}: <strong>{t.score}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
