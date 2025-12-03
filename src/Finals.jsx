import { useEffect, useState } from "react";
import { fallbackTeams } from "./fallbackTeams";

export default function Finals() {
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);

  function getTeam(id) {
    if (!id) return null;
    return fallbackTeams.find((t) => t.id === id) || null;
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
    const i = setInterval(load, 2000);
    return () => clearInterval(i);
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
      <img src="/roborave_logo_white.svg" style={styles.logo} />

      <h1 style={styles.title}>ROBORAVE FINALS</h1>

      <div style={styles.columnsWrapper}>
        {/* OCTAVOS */}
        {bracket.round16.length > 0 && (
          <FinalsColumn
            title="Octavos"
            matches={bracket.round16}
            getTeam={getTeam}
          />
        )}

        {/* CUARTOS */}
        {bracket.quarter.length > 0 && (
          <FinalsColumn
            title="Cuartos"
            matches={bracket.quarter}
            getTeam={getTeam}
          />
        )}

        {/* SEMIS */}
        {bracket.semi.length > 0 && (
          <FinalsColumn
            title="Semifinales"
            matches={bracket.semi}
            getTeam={getTeam}
          />
        )}

        {/* FINAL */}
        {bracket.final.length > 0 && (
          <FinalsColumn
            title="Final"
            matches={bracket.final}
            getTeam={getTeam}
          />
        )}
      </div>

      {bracket.champion && (
        <div style={styles.championBox}>
          <div style={styles.championTitle}>🏆 CAMPEÓN</div>
          <div style={styles.championTeam}>
            {getTeam(bracket.champion)?.name || "—"}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- */
/* ------------------------ COLUMNAS ------------------------- */
/* ---------------------------------------------------------- */

function FinalsColumn({ title, matches, getTeam }) {
  return (
    <div style={styles.column}>
      <div style={styles.columnTitle}>{title}</div>

      <div style={styles.matchList}>
        {matches.map((m) => (
          <FinalsMatch key={m.id} match={m} getTeam={getTeam} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- */
/* -------------------------- MATCH -------------------------- */
/* ---------------------------------------------------------- */

function FinalsMatch({ match, getTeam }) {
  const A = getTeam(match.a);
  const B = getTeam(match.b);

  return (
    <div style={styles.matchCard} className="score-card">
      <div style={styles.matchRowWithLogos}>
        {/* LOGO A */}
        {A ? (
          <img src={`/logos/${A.logo}`} style={styles.teamLogo} />
        ) : (
          <div style={styles.teamLogoPlaceholder}>–</div>
        )}

        {/* NOMBRE A */}
        <div style={styles.teamName}>{A?.name || "—"}</div>

        {/* VS */}
        <div style={styles.vs}>VS</div>

        {/* LOGO B */}
        {B ? (
          <img src={`/logos/${B.logo}`} style={styles.teamLogo} />
        ) : (
          <div style={styles.teamLogoPlaceholder}>–</div>
        )}

        {/* NOMBRE B */}
        <div style={styles.teamName}>{B?.name || "—"}</div>
      </div>

      {/* GANADOR */}
      {match.winner && (
        <div style={styles.winner}>
          Ganador: <strong>{getTeam(match.winner)?.name || "—"}</strong>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- */
/* --------------------------- ESTILOS ----------------------- */
/* ---------------------------------------------------------- */

const styles = {
  root: {
    width: "100vw",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% -40vh, #262626 0, #0b0b0b 45%, #000 100%)",
    padding: "40px 20px",
    boxSizing: "border-box",
    color: "white",
    textAlign: "center",
  },

  logo: {
    height: "80px",
    objectFit: "contain",
    marginBottom: "10px",
    filter:
      "drop-shadow(0 0 6px rgba(255,255,255,0.25)) drop-shadow(0 0 20px rgba(255,255,255,0.18))",
  },

  title: {
    fontSize: "30px",
    fontWeight: 900,
    marginBottom: "40px",
    letterSpacing: "0.15em",
    color: "#ffffffff",
    textShadow: "0 0 18px rgba(255,255,255,0.35)",
  },

  columnsWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    flexWrap: "wrap",
  },

  column: {
    minWidth: "260px",
    background: "rgba(255,255,255,0.05)",
    padding: "18px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(6px)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
  },

  columnTitle: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: "17px",
    color: "#ffebee",
    marginBottom: "14px",
    letterSpacing: "0.05em",
  },

  matchList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  matchCard: {
    padding: "14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
  },

  matchRowWithLogos: {
    display: "grid",
    gridTemplateColumns: "68px 1fr 40px 68px 1fr",
    alignItems: "center",
    gap: "12px",
    fontSize: "13px",
    fontWeight: 600,
    color: "white",
  },

  teamLogo: {
    width: "68px",
    height: "68px",
    borderRadius: "10px",
    objectFit: "contain",
    background: "rgba(255,255,255,0.10)",
    padding: "4px",
  },

  teamLogoPlaceholder: {
    width: "68px",
    height: "68px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
    fontSize: "28px",
  },

  teamName: {
    textAlign: "center",
    flex: 1,
    whiteSpace: "normal",
  },

  vs: {
    width: "40px",
    textAlign: "center",
    color: "rgba(255,255,255,0.6)",
    fontSize: "12px",
    fontWeight: 700,
  },

  winner: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#ffebee",
  },

  championBox: {
    marginTop: "40px",
    padding: "20px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.25)",
    textAlign: "center",
    boxShadow: "0 10px 24px rgba(0,0,0,0.65)",
  },

  championTitle: {
    fontSize: "18px",
    marginBottom: "8px",
    color: "#ffebee",
  },

  championTeam: {
    fontSize: "22px",
    fontWeight: 900,
    letterSpacing: "0.06em",
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

  /* ---------------- RESPONSIVE ---------------- */
  "@media (max-width: 480px)": {
    matchRowWithLogos: {
      gridTemplateColumns: "1fr",
      textAlign: "center",
      gap: "10px",
    },
    teamLogo: {
      margin: "0 auto",
    },
    teamLogoPlaceholder: {
      margin: "0 auto",
    },
    vs: {
      marginTop: "6px",
      marginBottom: "6px",
    },
    teamName: {
      fontSize: "14px",
      lineHeight: "18px",
    },
  },
};

export { styles };
