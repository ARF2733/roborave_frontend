import { useEffect, useState } from "react";
import { fallbackTeams } from "./fallbackTeams";

export default function Bracket() {
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Convertir id -> nombre real
  function getTeamName(id) {
    if (!id) return "—";
    const t = fallbackTeams.find((x) => x.id === id);
    return t ? t.name : `Equipo ${id}`;
  }

  // Cargar bracket cada 2 segundos
  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("https://roborave.onrender.com/api/bracket");
        const json = await r.json();
        setBracket(json);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    load();
    const itv = setInterval(load, 2000);
    return () => clearInterval(itv);
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingRoot}>
        <div style={styles.loading}>Cargando bracket…</div>
      </div>
    );
  }

  if (!bracket) {
    return (
      <div style={styles.loadingRoot}>
        <div style={styles.loading}>Sin datos</div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        <h1 style={styles.title}>BRACKET ELIMINATORIO</h1>

        {/* ROUND OF 16 */}
        {bracket.round16.length > 0 && (
          <BracketColumn
            title="Octavos de Final"
            matches={bracket.round16}
            getTeamName={getTeamName}
          />
        )}

        {/* QUARTER FINALS */}
        {bracket.quarter.length > 0 && (
          <BracketColumn
            title="Cuartos de Final"
            matches={bracket.quarter}
            getTeamName={getTeamName}
          />
        )}

        {/* SEMIS */}
        {bracket.semi.length > 0 && (
          <BracketColumn
            title="Semifinales"
            matches={bracket.semi}
            getTeamName={getTeamName}
          />
        )}

        {/* FINAL */}
        {bracket.final.length > 0 && (
          <BracketColumn
            title="Final"
            matches={bracket.final}
            getTeamName={getTeamName}
          />
        )}

        {/* CHAMPION */}
        {bracket.champion && (
          <div style={styles.championBox}>
            <div style={styles.championTitle}>🏆 CAMPEÓN</div>
            <div style={styles.championTeam}>
              {getTeamName(bracket.champion)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* ------------------- COLUMNAS ---------------------- */
/* -------------------------------------------------- */

function BracketColumn({ title, matches, getTeamName }) {
  return (
    <div style={styles.column}>
      <h2 style={styles.columnTitle}>{title}</h2>

      <div style={styles.matchList}>
        {matches.map((m) => (
          <BracketMatch key={m.id} match={m} getTeamName={getTeamName} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* ------------------ MATCH CARD --------------------- */
/* -------------------------------------------------- */

function BracketMatch({ match, getTeamName }) {
  return (
    <div style={styles.matchCard} className="score-card">
      <div style={styles.matchRow}>
        <span style={styles.team}>
          {getTeamName(match.a)}
        </span>

        <span style={styles.vs}>VS</span>

        <span style={styles.team}>
          {getTeamName(match.b)}
        </span>
      </div>

      {match.winner && (
        <div style={styles.winner}>
          Ganador: <strong>{getTeamName(match.winner)}</strong>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------- */
/* --------------------- ESTILOS --------------------- */
/* -------------------------------------------------- */

const styles = {
  root: {
    width: "100vw",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% -40vh, #262626 0, #0b0b0b 45%, #000 100%)",
    padding: 20,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
  },

  container: {
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  title: {
    textAlign: "center",
    color: "white",
    fontSize: "26px",
    letterSpacing: "0.12em",
    fontWeight: 800,
    marginBottom: "10px",
  },

  column: {
    background: "rgba(255,255,255,0.06)",
    padding: "16px 18px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(6px)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
  },

  columnTitle: {
    color: "#ffebee",
    fontSize: "18px",
    marginBottom: "12px",
    letterSpacing: "0.05em",
    textAlign: "center",
  },

  matchList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  matchCard: {
    padding: "14px 16px",
    background: "rgba(255,255,255,0.10)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(6px)",
  },

  matchRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "white",
    fontWeight: 600,
    fontSize: "14px",
    marginBottom: "6px",
  },

  vs: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "12px",
  },

  team: {
    flex: 1,
  },

  winner: {
    color: "#ffebee",
    fontSize: "13px",
    marginTop: "6px",
  },

  championBox: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.22)",
    textAlign: "center",
  },

  championTitle: {
    fontSize: "16px",
    color: "#ffebee",
    marginBottom: "8px",
    fontWeight: 700,
  },

  championTeam: {
    fontSize: "20px",
    color: "white",
    fontWeight: 800,
  },

  loadingRoot: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },

  loading: {
    fontSize: "18px",
    opacity: 0.8,
  },
};
