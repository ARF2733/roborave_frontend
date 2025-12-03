import { useEffect, useState } from "react";
import { fallbackTeams } from "./fallbackTeams";

export default function Finals() {
  const [categories, setCategories] = useState({});
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("judgeToken") || "";

  function getTeam(id) {
    
    return fallbackTeams.find((t) => t.id === id) || null;
  }

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("https://roborave.onrender.com/api/brackets");
        const json = await r.json();

        if (json.ok && json.categories) {
          setCategories(json.categories);

          if (!selectedCat || !json.categories[selectedCat]) {
            const first = Object.keys(json.categories)[0];
            if (first) setSelectedCat(first);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    const iv = setInterval(load, 1500);
    return () => clearInterval(iv);
  }, [selectedCat]);

  if (loading) {
    return <Centered text="Cargando Finals…" />;
  }

  if (!Object.keys(categories).length) {
    return <Centered text="Sin brackets generados" />;
  }

  const current = categories[selectedCat];

  return (
    <div style={styles.root}>
      <img src="/roborave_logo_white.svg" style={styles.logo} />
      <h1 style={styles.title}>RoboRAVE FINALS</h1>

      <select
        value={selectedCat || ""}
        onChange={(e) => setSelectedCat(e.target.value)}
        style={styles.dropdown}
      >
        {Object.keys(categories).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {current && (
        <>
          <FinalsCategory
            data={current}
            getTeam={getTeam}
            selectedCat={selectedCat}
            token={token}
          />

          {current.third && (
            <div style={{ marginTop: 40 }}>
              <h2 style={styles.categoryTitle}>🥉 Tercer Lugar</h2>
              <ThirdMatch data={current.third} getTeam={getTeam} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------- */
/* COMPONENTES SIMPLES */
/* ---------------------------------------------------- */

function Centered({ text }) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "20px",
      }}
    >
      {text}
    </div>
  );
}

/* ---------------------------------------------------- */
/* CATEGORY */
/* ---------------------------------------------------- */

function FinalsCategory({ data, getTeam, selectedCat, token }) {
  return (
    <>
      <div style={styles.columnsWrapper}>
        {data.round16?.length > 0 && (
          <FinalsColumn
            title="round16"
            label="Octavos"
            matches={data.round16}
            getTeam={getTeam}
            selectedCat={selectedCat}
            token={token}
          />
        )}

        {data.quarter?.length > 0 && (
          <FinalsColumn
            title="quarter"
            label="Cuartos"
            matches={data.quarter}
            getTeam={getTeam}
            selectedCat={selectedCat}
            token={token}
          />
        )}

        {data.semi?.length > 0 && (
          <FinalsColumn
            title="semi"
            label="Semifinales"
            matches={data.semi}
            getTeam={getTeam}
            selectedCat={selectedCat}
            token={token}
          />
        )}

        {data.final?.length > 0 && (
          <FinalsColumn
            title="final"
            label="Final"
            matches={data.final}
            getTeam={getTeam}
            selectedCat={selectedCat}
            token={token}
          />
        )}
      </div>

      {data.champion && (
        <div style={styles.championBox}>
          <div style={styles.championTitle}>🏆 CAMPEÓN</div>
          <div style={styles.championTeam}>
            {getTeam(data.champion)?.name || "—"}
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------------------------------------------- */
/* COLUMN */
/* ---------------------------------------------------- */

function FinalsColumn({ title, label, matches, getTeam, selectedCat, token }) {
  const compact = title === "final";

  return (
    <div
      style={{
        ...styles.column,
        padding: compact ? "16px 14px" : styles.column.padding,
      }}
    >
      <div style={styles.columnTitle}>{label}</div>

      <div style={styles.matchList}>
        {matches.map((m) => (
          <FinalsMatch
            key={m.id}
            match={m}
            round={title}
            getTeam={getTeam}
            compact={compact}
            selectedCat={selectedCat}
            token={token}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------- */
/* MATCH CON LOGO SELECCIONABLE Y GLOW */
/* ---------------------------------------------------- */

function FinalsMatch({
  match,
  round,
  getTeam,
  compact,
  selectedCat,
  token,
}) {
  const A = getTeam(match.a);
  const B = getTeam(match.b);

  const winner = match.winner;

  async function setWinner(winnerId) {
    if (!winnerId) return;
    await fetch("https://roborave.onrender.com/api/bracket/set-winner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({
        category: selectedCat,
        round,
        matchId: match.id,
        winner: winnerId,
      }),
    });
  }

  // ⭐ Glow mínimo, elegante y SOLO en logo ganador
  const logoGlow = (id) =>
    winner === id
      ? {
          filter: "drop-shadow(0 0 10px #00ff9a)",
          border: "1px solid rgba(0,255,150,0.9)",
          transform: "scale(1.05)",
        }
      : {
          opacity: 0.65,
        };

  return (
    <div style={styles.matchCard}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* TEAM A */}
        <div style={{ textAlign: "center" }}>
          <img
            src={`/logos/${A?.logo}`}
            style={{ ...styles.teamLogo, ...logoGlow(A?.id) }}
            onClick={() => setWinner(A?.id)}
          />
          <div style={styles.teamName}>{A?.name || "—"}</div>
        </div>

        <div style={{ fontSize: "20px", fontWeight: 900 }}>VS</div>

        {/* TEAM B */}
        <div style={{ textAlign: "center" }}>
          <img
            src={`/logos/${B?.logo}`}
            style={{ ...styles.teamLogo, ...logoGlow(B?.id) }}
            onClick={() => setWinner(B?.id)}
          />
          <div style={styles.teamName}>{B?.name || "—"}</div>
        </div>
      </div>

      {winner && (
        <div style={styles.winner}>
          Ganador: <strong>{getTeam(winner)?.name || "—"}</strong>
        </div>
      )}
    </div>
  );
}


/* ---------------------------------------------------- */
/* TERCER LUGAR */
/* ---------------------------------------------------- */

function ThirdMatch({ data, getTeam }) {
  const A = getTeam(data.a);
  const B = getTeam(data.b);

  return (
    <div style={styles.matchCard}>
      <div style={styles.matchRowWithLogos}>
        <img src={`/logos/${A?.logo}`} style={styles.teamLogo} />
        <div style={styles.teamName}>{A?.name}</div>

        <div style={styles.vs}>VS</div>

        <img src={`/logos/${B?.logo}`} style={styles.teamLogo} />
        <div style={styles.teamName}>{B?.name}</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------- */
/* ESTILOS (exactos a tu diseño original) */
/* ---------------------------------------------------- */

const styles = {
  root: {
    width: "100vw",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% -40vh, #2a2a2a 0, #0b0b0b 45%, #000 100%)",
    padding: "40px 20px",

    color: "white",
    textAlign: "center",

  },

  logo: {
    height: "84px",
    objectFit: "contain",
    marginBottom: "14px",

  },

  title: {
    fontSize: "32px",
    fontWeight: 900,
    marginBottom: "22px",
    letterSpacing: "0.18em",

  },

  dropdown: {
    padding: "12px 14px",
    fontSize: "16px",
    borderRadius: "12px",
    marginBottom: "32px",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.25)",

  },

  categoryTitle: {
    fontSize: "22px",
    marginBottom: "14px",
  },

  columnsWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "28px",
    flexWrap: "wrap",
  },

  column: {
    minWidth: "260px",
    background: "rgba(255,255,255,0.05)",
    padding: "20px 18px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.12)",

  },

  columnTitle: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: "18px",

    marginBottom: "16px",

  },

  matchList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  matchCard: {
    padding: "18px 16px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.15)",
  },

  /* 🟢 PREMIUM: Contenedor individual del equipo */
  teamBox: {
    textAlign: "center",
    padding: "10px",
    borderRadius: "14px",
    transition: "all 0.25s ease",
  },

  /* 🟢 PREMIUM: Glow elegante solo para ganador */
  winnerGlow: {
    boxShadow: "0 0 14px rgba(0,255,140,0.55)",
    border: "1px solid rgba(0,255,140,0.95)",
    transform: "scale(1.04)",
  },

  matchRowWithLogos: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",

  },

  teamLogo: {
  width: "72px",
  height: "72px",
  borderRadius: "12px",
  objectFit: "cover",
  background: "rgba(255,255,255,0.08)",
  padding: "4px",
  cursor: "pointer",
  transition: "all 0.25s ease",
},


  teamName: {
    fontSize: "15px",
    fontWeight: 700,
    textAlign: "center",

  },

  vs: {
    fontSize: "18px",
    fontWeight: 900,
    opacity: 0.7,
  },

  winner: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#ffefef",
  },

  championBox: {
    marginTop: "24px",
    padding: "24px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.15)",

  },

  championTitle: {
    fontSize: "19px",

  },

  championTeam: {
    fontSize: "24px",
    fontWeight: 900,

  },
};


export { styles };

