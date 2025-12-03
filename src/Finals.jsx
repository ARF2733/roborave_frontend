import { useEffect, useState } from "react";
import { fallbackTeams } from "./fallbackTeams";

export default function Finals() {
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);

  function getTeamName(id) {
    if (!id) return "—";
    const t = fallbackTeams.find((x) => x.id === id);
    return t ? t.name : `Equipo ${id}`;
  }

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
        <div style={styles.loading}>Cargando Finals…</div>
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
        {/* HEADER PREMIUM */}
        <div style={styles.header}>
          <img
            src="/roborave_logo_white.svg"
            alt="RoboRAVE"
            style={styles.headerLogo}
          />
          <div style={styles.headerTitle}>ROBORAVE FINALS</div>
        </div>

        {/* COLUMNAS DEL BRACKET */}
        <div style={styles.columnsWrapper}>
          {/* ROUND OF 16 */}
          {bracket.round16.length > 0 && (
            <BracketColumn
              title="Octavos"
              matches={bracket.round16}
              getTeamName={getTeamName}
            />
          )}

          {/* QUARTER */}
          {bracket.quarter.length > 0 && (
            <BracketColumn
              title="Cuartos"
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
        </div>

        {/* CAMPEÓN */}
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
      <div style={styles.columnTitle}>{title}</div>
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
        <span style={styles.team}>{getTeamName(match.a)}</span>
        <span style={styles.vs}>VS</span>
        <span style={styles.team}>{getTeamName(match.b)}</span>
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
    padding: "30px 20px 40px",
    boxSizing: "border-box",
    color: "white",
    display: "flex",
    justifyContent: "center",
  },

  container: {
    width: "100%",
    maxWidth: "980px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "26px",
  },

  /* HEADER PREMIUM */
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },

  headerLogo: {
    height: "72px",
    objectFit: "contain",
    filter:
      "drop-shadow(0 0 6px rgba(255,255,255,0.25)) drop-shadow(0 0 16px rgba(255,255,255,0.18))",
  },

  headerTitle: {
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "0.16em",
    color: "#ffebee",
    textTransform: "uppercase",
    textShadow: "0 0 16px rgba(255,0,0,0.35)",
  },

  columnsWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    gap: "22px",
    flexWrap: "wrap",
  },

  column: {
    minWidth: "190px",
    background: "rgba(255,255,255,0.05)",
    padding: "16px 16px 18px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(7px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
  },

  columnTitle: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: "15px",
    color: "#ffebee",
    marginBottom: "14px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  matchList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  matchCard: {
    padding: "14px 12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.16)",
    backdropFilter: "blur(8px)",
  },

  matchRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    fontWeight: 600,
    gap: "6px",
  },

  team: {
    flex: 1,
    textAlign: "center",
    lineHeight: 1.25,
  },

  vs: {
    width: "40px",
    textAlign: "center",
    color: "rgba(255,255,255,0.65)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
  },

  winner: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#ffebee",
    textAlign: "center",
    opacity: 0.9,
  },

  championBox: {
    marginTop: "26px",
    padding: "20px 22px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.10))",
    border: "1px solid rgba(255,255,255,0.35)",
    textAlign: "center",
    boxShadow: "0 14px 32px rgba(0,0,0,0.75)",
    minWidth: "260px",
  },

  championTitle: {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#2b2b2b",
    fontWeight: 800,
    letterSpacing: "0.08em",
  },

  championTeam: {
    fontSize: "22px",
    fontWeight: 900,
    letterSpacing: "0.10em",
    color: "#111",
    textTransform: "uppercase",
  },

  loadingRoot: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at 50% -40vh, #262626 0, #0b0b0b 45%, #000 100%)",
    color: "white",
  },

  loading: {
    fontSize: "18px",
    opacity: 0.85,
  },
};
