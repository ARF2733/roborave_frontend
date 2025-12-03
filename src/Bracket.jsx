import { useEffect, useState } from "react";

export default function Bracket() {
  const [category, setCategory] = useState("SUMO1K_HS"); // categoría inicial
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Cargar bracket de la API ---
  const loadBracket = async () => {
    setLoading(true);
    const r = await fetch(`https://roborave.onrender.com/api/bracket?category=${category}`);
    const json = await r.json();
    setBracket(json);
    setLoading(false);
  };

  // cargar al arrancar
  useEffect(() => {
    loadBracket();
  }, [category]);

  // --- Generar TOP 16 desde backend ---
  const generate = async () => {
    const token = localStorage.getItem("judgeToken");
    if (!token) {
      alert("No autorizado");
      return;
    }

    const r = await fetch("https://roborave.onrender.com/api/bracket/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ category })
    });

    const json = await r.json();
    if (!json.ok) return alert(json.error || "Error generando bracket");

    setBracket(json.bracket);
  };

  if (!bracket) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        Cargando...
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <h1 style={styles.title}>Bracket — {category}</h1>

      {/* SELECTOR DE CATEGORÍA */}
      <select
        style={styles.selector}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="SUMO1K_HS">Sumo 1 Kg HS</option>
        <option value="SUMO_ES">Sumo ES</option>
        <option value="A-MAZE-ING_ES">a-MAZE-ing ES</option>
        <option value="SOCCER_ES">Soccer ES</option>
      </select>

      {/* BOTÓN GENERAR */}
      <button style={styles.generateBtn} onClick={generate}>
        Generar Top 16
      </button>

      {/* BRACKET MOBILE FIRST */}
      <div style={styles.column}>
        <h2 style={styles.round}>Round of 16</h2>
        {bracket.round16.map(m => (
          <Match key={m.id} match={m} />
        ))}
      </div>

      <div style={styles.column}>
        <h2 style={styles.round}>Quarter Finals</h2>
        {bracket.quarter.map(m => (
          <Match key={m.id} match={m} />
        ))}
      </div>

      <div style={styles.column}>
        <h2 style={styles.round}>Semi Finals</h2>
        {bracket.semi.map(m => (
          <Match key={m.id} match={m} />
        ))}
      </div>

      <div style={styles.column}>
        <h2 style={styles.round}>Final</h2>
        {bracket.final.map(m => (
          <Match key={m.id} match={m} />
        ))}

        {bracket.champion && (
          <div style={styles.championBox}>
            🏆 Campeón: Equipo {bracket.champion}
          </div>
        )}
      </div>
    </div>
  );
}

/* COMPONENTE MATCH */
function Match({ match }) {
  return (
    <div style={styles.match}>
      <div style={styles.team}>Equipo {match.a ?? "?"}</div>
      <div style={styles.vs}>vs</div>
      <div style={styles.team}>Equipo {match.b ?? "?"}</div>
      {match.winner && <div style={styles.winner}>Ganador: {match.winner}</div>}
    </div>
  );
}

/* ESTILOS */
const styles = {
  root: {
    padding: 20,
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    background:
      "radial-gradient(circle at 50% -40vh, #262626 0, #0b0b0b 45%, #000 100%)",
    minHeight: "100vh"
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    textAlign: "center"
  },
  selector: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    background: "rgba(255,255,255,0.1)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.2)"
  },
  generateBtn: {
    padding: 14,
    borderRadius: 10,
    background: "rgba(255,255,255,0.15)",
    color: "white",
    fontSize: 16,
    border: "1px solid rgba(255,255,255,0.25)"
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  round: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8
  },
  match: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: 14,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  team: { color: "white", fontSize: 14 },
  vs: { textAlign: "center", opacity: 0.7 },
  winner: { marginTop: 4, opacity: 0.85, fontSize: 13 },
  championBox: {
    marginTop: 16,
    padding: 16,
    textAlign: "center",
    background: "rgba(255,215,0,0.2)",
    borderRadius: 12,
    fontSize: 18,
    fontWeight: "bold"
  }
};
