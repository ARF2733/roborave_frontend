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
      "radial-gradient(circle at 50% -40vh, #2a2a2a 0, #0b0b0b 45%, #000 100%)",
    padding: "40px 20px",
    boxSizing: "border-box",
    color: "white",
    textAlign: "center",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  },

  /* --------- LOGO --------- */
  logo: {
    height: "84px",
    objectFit: "contain",
    marginBottom: "12px",
    filter:
      "drop-shadow(0 0 6px rgba(255,255,255,0.25)) drop-shadow(0 0 26px rgba(255,255,255,0.20))",
  },

  /* --------- TÍTULO --------- */
  title: {
    fontSize: "32px",
    fontWeight: 900,
    marginBottom: "38px",
    letterSpacing: "0.18em",
    color: "#ffffff",
    textShadow: "0 0 22px rgba(255,255,255,0.35)",
  },

  /* --------- CONTENEDOR COLUMNAS --------- */
  columnsWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "26px",
    flexWrap: "wrap",
  },

  /* --------- COLUMNA (Semis, Cuartos, Final) --------- */
  column: {
    minWidth: "260px",
    background: "rgba(255,255,255,0.05)",
    padding: "20px 18px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 8px 22px rgba(0,0,0,0.55)",
  },

  columnTitle: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: "18px",
    color: "#ffebee",
    marginBottom: "16px",
    letterSpacing: "0.05em",
    textShadow: "0 0 12px rgba(255,180,180,0.25)",
  },

  matchList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  /* --------- TARJETAS DE MATCH --------- */
  matchCard: {
    padding: "16px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
  },

  /* --------- FILA CON LOGOS Y NOMBRES (desktop) --------- */
  matchRowWithLogos: {
    display: "grid",
    gridTemplateColumns: "68px 1fr 40px 68px 1fr",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    fontWeight: 600,
    color: "white",
  },

  /* --------- LOGOS --------- */
  teamLogo: {
    width: "68px",
    height: "68px",
    borderRadius: "12px",
    objectFit: "contain",
    background: "rgba(255,255,255,0.08)",
    padding: "4px",
    boxShadow:
      "0 0 6px rgba(0,0,0,0.45), inset 0 0 4px rgba(255,255,255,0.15)",
  },

  teamLogoPlaceholder: {
    width: "68px",
    height: "68px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
    fontSize: "30px",
  },

  /* --------- NOMBRES --------- */
  teamName: {
    textAlign: "center",
    fontWeight: 700,
    lineHeight: "18px",
    whiteSpace: "normal",
  },

  /* --------- VS --------- */
  vs: {
    width: "40px",
    textAlign: "center",
    color: "rgba(255,255,255,0.6)",
    fontSize: "13px",
    fontWeight: 800,
  },

  /* --------- GANADOR --------- */
  winner: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#ffebee",
    fontWeight: 600,
  },

  /* --------- CAMPEÓN --------- */
  championBox: {
    marginTop: "42px",
    padding: "22px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.25)",
    textAlign: "center",
    boxShadow: "0 10px 28px rgba(0,0,0,0.65)",
  },

  championTitle: {
    fontSize: "19px",
    marginBottom: "10px",
    color: "#ffebee",
    textShadow: "0 0 10px rgba(255,200,200,0.35)",
  },

  championTeam: {
    fontSize: "24px",
    fontWeight: 900,
    letterSpacing: "0.05em",
  },

  /* --------- LOADING --------- */
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

  /* --------- RESPONSIVE (MOBILE-FIRST) --------- */
  "@media (max-width: 480px)": {
    matchRowWithLogos: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
    },

    vs: {
      margin: "4px 0",
      fontSize: "15px",
      fontWeight: 900,
    },

    teamLogo: {
      width: "80px",
      height: "80px",
    },

    teamName: {
      fontSize: "15px",
      fontWeight: 700,
      marginTop: "4px",
    },
  },
};

export { styles };
