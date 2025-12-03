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

  function getLogo(id) {
    const t = fallbackTeams.find((x) => x.id === id);
    return t ? `/logos/${t.logo}` : null;
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
      <img src="/roborave_logo_white.svg" alt="RoboRAVE" style={styles.logo} />

      <div style={styles.title}>ROBORAVE FINALS</div>

      <div style={styles.columnsWrapper}>
        {bracket.round16.length > 0 && (
          <BracketColumn
            title="Octavos"
            matches={bracket.round16}
            getTeamName={getTeamName}
            getLogo={getLogo}
          />
        )}

        {bracket.quarter.length > 0 && (
          <BracketColumn
            title="Cuartos"
            matches={bracket.quarter}
            getTeamName={getTeamName}
            getLogo={getLogo}
          />
        )}

        {bracket.semi.length > 0 && (
          <BracketColumn
            title="Semifinales"
            matches={bracket.semi}
            getTeamName={getTeamName}
            getLogo={getLogo}
          />
        )}

        {bracket.final.length > 0 && (
          <BracketColumn
            title="Final"
            matches={bracket.final}
            getTeamName={getTeamName}
            getLogo={getLogo}
          />
        )}
      </div>

      {bracket.champion && (
        <div style={styles.championBox}>
          <div style={styles.championTitle}>🏆 CAMPEÓN</div>
          <div style={styles.championTeam}>
            {getTeamName(bracket.champion)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------ COLUMNAS ------------------ */

function BracketColumn({ title, matches, getTeamName, getLogo }) {
  return (
    <div style={styles.column}>
      <div style={styles.columnTitle}>{title}</div>

      <div style={styles.matchList}>
        {matches.map((m) => (
          <BracketMatch
            key={m.id}
            match={m}
            getTeamName={getTeamName}
            getLogo={getLogo}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------ MATCH CARD ------------------ */

function BracketMatch({ match, getTeamName, getLogo }) {
  const logoA = getLogo(match.a);
  const logoB = getLogo(match.b);

  return (
    <div style={styles.matchCard} className="score-card">
      <div style={styles.matchRowWithLogos}>
        {/* LOGO A */}
        {logoA ? (
          <img src={logoA} style={styles.teamLogo} />
        ) : (
          <div style={styles.teamLogoPlaceholder}>—</div>
        )}

        {/* TEAM A */}
        <span style={styles.teamName}>{getTeamName(match.a)}</span>

        {/* VS */}
        <span style={styles.vs}>VS</span>

        {/* TEAM B */}
        <span style={styles.teamName}>{getTeamName(match.b)}</span>

        {/* LOGO B */}
        {logoB ? (
          <img src={logoB} style={styles.teamLogo} />
        ) : (
          <div style={styles.teamLogoPlaceholder}>—</div>
        )}
      </div>

      {match.winner && (
        <div style={styles.winner}>
          Ganador: <strong>{getTeamName(match.winner)}</strong>
        </div>
      )}
    </div>
  );
}

/* ------------------ ESTILOS ------------------ */

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
    textShadow: "0 0 18px rgba(255, 255, 255, 0.35)",
  },

  columnsWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    flexWrap: "wrap",
  },

  column: {
    minWidth: "200px",
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
    gridTemplateColumns: "40px 1fr 40px 1fr 40px",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
    fontWeight: 600,
    color: "white",
  },

  teamLogo: {
    width: "34px",
    height: "34px",
    borderRadius: "6px",
    objectFit: "contain",
    background: "rgba(255,255,255,0.10)",
    padding: "4px",
  },

  teamLogoPlaceholder: {
    width: "34px",
    height: "34px",
    borderRadius: "6px",
    background: "rgba(255,255,255,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
  },

  teamName: {
    textAlign: "center",
    flex: 1,
  },

  vs: {
    width: "40px",
    textAlign: "center",
    color: "rgba(255,255,255,0.6)",
  },

  winner: {
    marginTop: "8px",
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
  },

  loading: {
    fontSize: "18px",
    opacity: 0.8,
  },
};
