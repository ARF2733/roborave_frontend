import { useEffect, useState } from "react";
import { fallbackTeams } from "./fallbackTeams";

export default function Finals() {
  const [categories, setCategories] = useState({});
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("judgeToken") || ""; // token del juez

  function getTeam(id) {
    if (!id) return null;
    return fallbackTeams.find((t) => t.id === id) || null;
  }

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("https://roborave.onrender.com/api/brackets");
        const json = await r.json();

        if (json.ok && json.categories) {
          const newCats = json.categories;
          setCategories(newCats);

          if (!selectedCat || !newCats[selectedCat]) {
            const first = Object.keys(newCats)[0];
            if (first) setSelectedCat(first);
          }
        }

        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    load();
    const itv = setInterval(load, 2000);
    return () => clearInterval(itv);
  }, [selectedCat]);

  if (loading) {
    return (
      <div style={styles.loadingRoot}>
        <div style={styles.loading}>Cargando Finals…</div>
      </div>
    );
  }

  if (!Object.keys(categories).length) {
    return (
      <div style={styles.loadingRoot}>
        <div style={styles.loading}>Sin brackets generados</div>
      </div>
    );
  }

  const current = categories[selectedCat];

  return (
    <div style={styles.root}>
      <img src="/roborave_logo_white.svg" style={styles.logo} />
      <h1 style={styles.title}>ROBORAVE FINALS</h1>

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
        <div style={styles.categoryBlock}>
          <h2 style={styles.categoryTitle}>{selectedCat}</h2>
          <FinalsCategory
            data={current}
            getTeam={getTeam}
            selectedCat={selectedCat}
            token={token}
          />
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- */
/* -------------------- CATEGORY WRAPPER --------------------- */
/* ---------------------------------------------------------- */

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

/* ---------------------------------------------------------- */
/* ------------------------ COLUMNAS ------------------------- */
/* ---------------------------------------------------------- */

function FinalsColumn({
  title,
  label,
  matches,
  getTeam,
  selectedCat,
  token,
}) {
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

/* ---------------------------------------------------------- */
/* -------------------------- MATCH -------------------------- */
/* ---------------------------------------------------------- */

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

  const buttonStyle = (isWinner) => ({
    padding: "8px 14px",
    borderRadius: "10px",
    marginTop: "6px",
    background: isWinner
      ? "rgba(0,255,120,0.25)"
      : "rgba(255,255,255,0.12)",
    border: isWinner
      ? "1px solid rgba(0,255,140,0.8)"
      : "1px solid rgba(255,255,255,0.20)",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
  });

  return (
    <div style={styles.matchCard}>
      {compact ? (
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
            {A ? (
              <img src={`/logos/${A.logo}`} style={styles.teamLogo} />
            ) : (
              <div style={styles.teamLogoPlaceholder}>–</div>
            )}
            <div style={styles.teamName}>{A?.name || "—"}</div>

            <div
              style={buttonStyle(match.winner === A?.teamId)}
              onClick={() => setWinner(A?.teamId)}
            >
              Ganó A
            </div>
          </div>

          <div style={{ fontSize: "20px", fontWeight: 900 }}>VS</div>

          {/* TEAM B */}
          <div style={{ textAlign: "center" }}>
            {B ? (
              <img src={`/logos/${B.logo}`} style={styles.teamLogo} />
            ) : (
              <div style={styles.teamLogoPlaceholder}>–</div>
            )}
            <div style={styles.teamName}>{B?.name || "—"}</div>

            <div
              style={buttonStyle(match.winner === B?.teamId)}
              onClick={() => setWinner(B?.teamId)}
            >
              Ganó B
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* LAYOUT NORMAL */}
          <div style={styles.matchRowWithLogos}>
            {A ? (
              <img src={`/logos/${A.logo}`} style={styles.teamLogo} />
            ) : (
              <div style={styles.teamLogoPlaceholder}>–</div>
            )}
            <div style={styles.teamName}>{A?.name || "—"}</div>

            <div style={styles.vs}>VS</div>

            {B ? (
              <img src={`/logos/${B.logo}`} style={styles.teamLogo} />
            ) : (
              <div style={styles.teamLogoPlaceholder}>–</div>
            )}
            <div style={styles.teamName}>{B?.name || "—"}</div>
          </div>

          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <div
              style={buttonStyle(match.winner === A?.teamId)}
              onClick={() => setWinner(A?.teamId)}
            >
              Ganó A
            </div>

            <div
              style={buttonStyle(match.winner === B?.teamId)}
              onClick={() => setWinner(B?.teamId)}
            >
              Ganó B
            </div>
          </div>
        </>
      )}

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

  logo: {
    height: "84px",
    objectFit: "contain",
    marginBottom: "14px",
    filter:
      "drop-shadow(0 0 8px rgba(255,255,255,0.25)) drop-shadow(0 0 24px rgba(255,255,255,0.20))",
  },

  title: {
    fontSize: "32px",
    fontWeight: 900,
    marginBottom: "22px",
    letterSpacing: "0.18em",
    color: "#ffffff",
    textShadow: "0 0 20px rgba(255,255,255,0.35)",
  },

  dropdown: {
    padding: "12px 14px",
    fontSize: "16px",
    borderRadius: "12px",
    marginBottom: "32px",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.25)",
    backdropFilter: "blur(6px)",
  },

  categoryBlock: {
    marginBottom: "60px",
  },

  categoryTitle: {
    fontSize: "24px",
    fontWeight: 900,
    marginBottom: "24px",
    letterSpacing: "0.08em",
    color: "#ffefef",
    textShadow: "0 0 12px rgba(255,200,200,0.35)",
    textTransform: "uppercase",
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
    textShadow: "0 0 10px rgba(255,180,180,0.25)",
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
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
  },

  matchRowWithLogos: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    color: "white",
  },

  teamLogo: {
    width: "72px",
    height: "72px",
    borderRadius: "12px",
    objectFit: "cover",
    background: "rgba(255,255,255,0.08)",
    padding: "6px",
    boxShadow:
      "0 0 6px rgba(0,0,0,0.45), inset 0 0 4px rgba(255,255,255,0.15)",
  },

  teamLogoPlaceholder: {
    width: "72px",
    height: "72px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
    fontSize: "32px",
  },

  teamName: {
    fontSize: "15px",
    fontWeight: 700,
    textAlign: "center",
    maxWidth: "180px",
    lineHeight: "18px",
  },

  vs: {
    fontSize: "18px",
    fontWeight: 900,
    color: "rgba(255,255,255,0.7)",
    margin: "8px 0 4px",
  },

  winner: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#ffebee",
    fontWeight: 600,
  },

  championBox: {
    marginTop: "24px",
    padding: "24px",
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

export { styles };

