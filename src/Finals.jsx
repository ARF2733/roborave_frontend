import { useEffect, useState } from "react";
import { fallbackTeams } from "./fallbackTeams";

/* ---------------------------------------------------- */
/* ROOT COMPONENT */
/* ---------------------------------------------------- */

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
    const iv = setInterval(load, 1200);
    return () => clearInterval(iv);
  }, [selectedCat]);

  if (loading) return <Centered text="Cargando Finals…" />;

  if (!Object.keys(categories).length)
    return <Centered text="Sin brackets generados" />;

  const current = categories[selectedCat];
  const final = current?.final?.[0];
  const champion = current?.champion;
  const second =
    final && final.winner
      ? final.a === final.winner
        ? final.b
        : final.a
      : null;

  const third = current?.thirdWinner;

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

          {/* ----------------- 3ER LUGAR (arriba del Podium) ------------------ */}
          {current.third && (
            <div style={{ marginTop: 50 }}>
              <h2 style={styles.categoryTitle}>Third Place Match</h2>
              <ThirdMatch
                match={current.third}
                getTeam={getTeam}
                selectedCat={selectedCat}
                token={token}
              />
            </div>
          )}

          {/* ----------------- PODIUM OFICIAL (único bloque final) ------------------ */}
          {champion && second && third && (
            <OfficialPodium
              champion={getTeam(champion)}
              second={getTeam(second)}
              third={getTeam(third)}
            />
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
            label="Round 16"
            matches={data.round16}
            getTeam={getTeam}
            selectedCat={selectedCat}
            token={token}
          />
        )}

        {data.round8?.length > 0 && (
          <FinalsColumn
            title="round8"
            label="Round 8"
            matches={data.round8}
            getTeam={getTeam}
            selectedCat={selectedCat}
            token={token}
          />
        )}

        {data.quarter?.length > 0 && (
          <FinalsColumn
            title="quarter"
            label="Quarter"
            matches={data.quarter}
            getTeam={getTeam}
            selectedCat={selectedCat}
            token={token}
          />
        )}

        {data.semi?.length > 0 && (
          <FinalsColumn
            title="semi"
            label="Semifinals"
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
/* MATCH */
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

  const logoGlow = (id) =>
    winner === id
      ? {
          filter: "drop-shadow(0 0 10px #ffffffff)",
          border: "1px solid rgba(0, 0, 0, 0.44)",
          transform: "scale(1.05)",
        }
      : { opacity: 0.6 };

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
            src={A ? `/logos/${A.logo}` : ""}
            style={{ ...styles.teamLogo, ...(A ? logoGlow(A.id) : {}) }}
            onClick={() => setWinner(A?.id)}
          />
          <div style={styles.teamName}>{A?.name || "—"}</div>
        </div>

        <div style={{ fontSize: "20px", fontWeight: 900 }}>VS</div>

        {/* TEAM B */}
        <div style={{ textAlign: "center" }}>
          <img
            src={B ? `/logos/${B.logo}` : ""}
            style={{ ...styles.teamLogo, ...(B ? logoGlow(B.id) : {}) }}
            onClick={() => setWinner(B?.id)}
          />
          <div style={styles.teamName}>{B?.name || "—"}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------- */
/* 3RD PLACE MATCH */
/* ---------------------------------------------------- */

function ThirdMatch({ match, getTeam, selectedCat, token }) {
  if (!match) return null;

  const A = getTeam(match.a);
  const B = getTeam(match.b);
  const winner = match.winner;

  async function setWinnerThird(id) {
    await fetch("https://roborave.onrender.com/api/bracket/set-winner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({
        category: selectedCat,
        round: "third",
        matchId: match.id,
        winner: id,
      }),
    });
  }

  const glow = (id) =>
    winner === id
      ? {
          filter: "drop-shadow(0 0 10px #ffffffff)",
          border: "1px solid rgba(0, 0, 0, 0.44)",
          transform: "scale(1.05)",
        }
      : { opacity: 0.6 };

  return (
    <div style={styles.matchCard}>
      <div style={styles.matchRowWithLogos}>
        {/* TEAM A */}
        <div style={{ textAlign: "center" }}>
          <img
            src={A ? `/logos/${A.logo}` : ""}
            style={{ ...styles.teamLogo, ...(A ? glow(A.id) : {}) }}
            onClick={() => A && setWinnerThird(A.id)}
          />
          <div style={styles.teamName}>{A?.name || "—"}</div>
        </div>

        <div style={styles.vs}>VS</div>

        {/* TEAM B */}
        <div style={{ textAlign: "center" }}>
          <img
            src={B ? `/logos/${B.logo}` : ""}
            style={{ ...styles.teamLogo, ...(B ? glow(B.id) : {}) }}
            onClick={() => B && setWinnerThird(B.id)}
          />
          <div style={styles.teamName}>{B?.name || "—"}</div>
        </div>
      </div>

    </div>
  );
}

/* ---------------------------------------------------- */
/* PODIUM OFICIAL (VERTICAL, ELEGANTE, PREMIUM™) */
/* ---------------------------------------------------- */

function OfficialPodium({ champion, second, third }) {
  return (
    <div style={{ marginTop: 60 }}>
      <h2 style={styles.podiumTitle}>Official Podium</h2>

      <div style={styles.podiumColumn}>
        <PodiumCard place="🥇" team={champion} big />
        <PodiumCard place="🥈" team={second} />
        <PodiumCard place="🥉" team={third} />
      </div>
    </div>
  );
}

function PodiumCard({ place, team, big }) {
  const metal =
    place === "🥇"
      ? styles.podiumCardGold
      : place === "🥈"
      ? styles.podiumCardSilver
      : styles.podiumCardBronze;

  return (
    <div
      style={{
        ...styles.podiumCard,
        ...metal,
        ...(big ? { transform: "scale(1.15)" } : {}),
      }}
    >
      <div style={styles.podiumPlace}>{place}</div>

      <img src={`/logos/${team.logo}`} style={styles.podiumLogo} alt="" />

      <div style={styles.podiumName}>{team.name}</div>
    </div>
  );
}


/* ---------------------------------------------------- */
/* ESTILOS */
/* ---------------------------------------------------- */

const styles = {
  root: {
    width: "100vw",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% -40vh, #1d1d1d 0, #0a0a0a 45%, #000 100%)",
    padding: "40px 20px",
    color: "white",
    textAlign: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  logo: {
    height: "84px",
    objectFit: "contain",
    marginBottom: "14px",
    filter: "drop-shadow(0 0 4px rgba(255,255,255,0.15))",
  },

  title: {
    fontSize: "32px",
    fontWeight: 900,
    marginBottom: "22px",
    letterSpacing: "0.18em",
    textShadow: "0 0 8px rgba(255,255,255,0.1)",
  },

  dropdown: {
    padding: "12px 14px",
    fontSize: "16px",
    borderRadius: "14px",
    marginBottom: "32px",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(12px)",
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
    background: "rgba(255,255,255,0.04)",
    padding: "20px 18px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(6px)",
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
    borderRadius: "18px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 4px 18px rgba(0,0,0,0.35)",
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
    borderRadius: "14px",
    objectFit: "cover",
    background: "rgba(255,255,255,0.1)",
    padding: "4px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 0 8px rgba(0,0,0,0.35)",
  },

  teamName: {
    fontSize: "15px",
    fontWeight: 700,
    textAlign: "center",
    opacity: 0.95,
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

  /* ----------------------------------------------------------
     PODIUM — APPLE VISIONOS GLASS DESIGN
     ---------------------------------------------------------- */

  podiumTitle: {
    fontSize: "30px",
    marginTop: "60px",
    marginBottom: "32px",
    fontWeight: 900,
    letterSpacing: "0.03em",
    color: "white",
    textShadow: "0 0 12px rgba(255,255,255,0.15)",
  },

  podiumColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "36px",
  },

  /* Cartas translúcidas estilo VisionOS */
  podiumCard: {
    width: "240px",
    padding: "28px 20px",
    borderRadius: "28px",
    textAlign: "center",
    backdropFilter: "blur(32px)",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",

    /* glass border */
    border: "1px solid rgba(255,255,255,0.25)",

    /* soft shadows VisionOS */
    boxShadow: `
      0 4px 25px rgba(0,0,0,0.45),
      inset 0 0 40px rgba(255,255,255,0.06)
    `,

    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },

  /* ORO — minimal elegante */
  podiumCardGold: {
    border: "1.6px solid rgba(255,215,0,0.85)",
    boxShadow: `
      0 4px 28px rgba(255,220,115,0.35),
      inset 0 0 40px rgba(255,255,255,0.08)
    `,
  },

  /* PLATA */
  podiumCardSilver: {
    border: "1.6px solid rgba(210,210,210,0.85)",
    boxShadow: `
      0 4px 28px rgba(210,210,210,0.30),
      inset 0 0 40px rgba(255,255,255,0.08)
    `,
  },

  /* BRONCE */
  podiumCardBronze: {
    border: "1.6px solid rgba(205,127,50,0.85)",
    boxShadow: `
      0 4px 28px rgba(205,127,50,0.35),
      inset 0 0 40px rgba(255,255,255,0.08)
    `,
  },

  podiumPlace: {
    fontSize: "26px",
    fontWeight: 800,
    marginBottom: "14px",
    opacity: 0.95,
    textShadow: "0 0 10px rgba(255,255,255,0.12)",
  },

  podiumLogo: {
    width: "94px",
    height: "94px",
    borderRadius: "18px",
    objectFit: "cover",
    marginBottom: "14px",

    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.25)",
    backdropFilter: "blur(20px)",

    boxShadow: `
      0 4px 14px rgba(0,0,0,0.55),
      inset 0 0 12px rgba(255,255,255,0.15)
    `,
  },

  podiumName: {
    fontSize: "18px",
    fontWeight: 800,
    marginTop: "6px",
    letterSpacing: "0.4px",
    opacity: 0.95,
  },
};

export { styles };
