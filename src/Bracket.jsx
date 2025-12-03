import { useEffect, useState } from "react";

export default function Bracket() {
  const [bracket, setBracket] = useState(null);

  // Cargar bracket cada 2 segundos
  useEffect(() => {
    const load = async () => {
      const r = await fetch("https://roborave.onrender.com/api/bracket");
      const json = await r.json();
      setBracket(json);
    };
    load();
    const itv = setInterval(load, 2000);
    return () => clearInterval(itv);
  }, []);

  if (!bracket) return <div style={styles.loading}>Cargando bracket...</div>;

  return (
    <div style={styles.root}>
      <h1 style={styles.title}>Bracket Eliminatorio</h1>

      <div style={styles.columnsWrapper}>

        {/* ------------------ 16 → 8 ------------------ */}
        <div style={styles.column}>
          <h2 style={styles.columnTitle}>Octavos</h2>
          {bracket.round16.map((m) => (
            <Match key={m.id} match={m} />
          ))}
        </div>

        {/* ------------------ 8 → 4 ------------------ */}
        <div style={styles.column}>
          <h2 style={styles.columnTitle}>Cuartos</h2>
          {bracket.quarter.map((m) => (
            <Match key={m.id} match={m} />
          ))}
        </div>

        {/* ------------------ 4 → 2 ------------------ */}
        <div style={styles.column}>
          <h2 style={styles.columnTitle}>Semifinales</h2>
          {bracket.semi.map((m) => (
            <Match key={m.id} match={m} />
          ))}
        </div>

        {/* ------------------ 2 → 1 ------------------ */}
        <div style={styles.column}>
          <h2 style={styles.columnTitle}>Final</h2>
          {bracket.final.map((m) => (
            <Match key={m.id} match={m} />
          ))}

          {bracket.champion && (
            <div style={styles.championBox}>
              <div style={styles.championCrown}>👑</div>
              <div style={styles.championName}>
                {findTeamName(bracket, bracket.champion)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Match({ match }) {
  return (
    <div style={styles.match}>
      <div
        style={{
          ...styles.team,
          ...(match.winner === match.a ? styles.winner : {})
        }}
      >
        {match.a ? findTeamName(null, match.a) : "??"}
      </div>

      <div
        style={{
          ...styles.team,
          ...(match.winner === match.b ? styles.winner : {})
        }}
      >
        {match.b ? findTeamName(null, match.b) : "??"}
      </div>
    </div>
  );
}

function findTeamName(bracket, id) {
  if (!window.fallbackTeams) return `Team ${id}`;
  const t = window.fallbackTeams.find((x) => x.id === id);
  return t ? t.name : `Team ${id}`;
}

const styles = {
  root: {
    width: "100vw",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% -40vh, #202020 0, #0b0b0b 45%, #000 100%)",
    color: "white",
    padding: "20px",
    boxSizing: "border-box",
  },

  title: {
    textAlign: "center",
    fontSize: "26px",
    fontWeight: 800,
    marginBottom: "24px",
    letterSpacing: "0.1em",
    color: "#ffebee",
  },

  columnsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },

  column: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    padding: "10px 0",
    borderLeft: "2px solid rgba(255,255,255,0.12)",
    paddingLeft: "16px",
  },

  columnTitle: {
    fontSize: "16px",
    fontWeight: 700,
    opacity: 0.85,
    marginBottom: "4px",
  },

  match: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    backdropFilter: "blur(6px)",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    transition: "0.25s",
  },

  team: {
    padding: "10px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: "15px",
    fontWeight: 600,
    textAlign: "center",
  },

  winner: {
    background: "rgba(76,175,80,0.25)",
    borderColor: "rgba(76,175,80,0.45)",
    boxShadow: "0 0 10px rgba(76,175,80,0.55)",
  },

  championBox: {
    marginTop: "32px",
    padding: "18px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "14px",
    textAlign: "center",
  },

  championCrown: {
    fontSize: "32px",
    marginBottom: "10px",
  },

  championName: {
    fontSize: "18px",
    fontWeight: 800,
  },

  loading: {
    padding: 40,
    textAlign: "center",
    color: "white",
  },
};

