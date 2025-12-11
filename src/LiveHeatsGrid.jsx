// LiveHeatsGrid.jsx
export default function LiveHeatsGrid({ teams, qualified }) {
  return (
    <div style={styles.grid}>
      {teams.map((t, index) => {
        const isQualified = qualified?.has(t.id);

        return (
          <div
            key={t.id}
            style={{
              ...styles.card,
              ...(isQualified ? styles.cardQualified : {}),
            }}
            className="score-card"
          >
            {/* ICONO CLASIFICADO / NO CLASIFICADO */}
            <span style={styles.statusIcon}>
              {isQualified ? "✅" : ""}
            </span>


            {/* LOGO */}
            <img src={`/logos/${t.logo}`} alt={t.name} style={styles.logo} />

            {/* INFO */}
            <div style={styles.info}>
              <div style={styles.name}>{t.name}</div>

              <div style={styles.meta}>
                <img
                  src={`/flags/${t.flag}.png`}
                  alt={t.flag}
                  style={styles.flag}
                />
                <span style={styles.country}>{t.flag.toUpperCase()}</span>
              </div>
            </div>

            {/* SCORE */}
            <div style={styles.score}>{t.score}</div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
  },

  card: {
    position: "relative",

    background:
      "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",

    borderRadius: "16px",
    padding: "18px 20px",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",

    border: "1px solid rgba(255,255,255,0.20)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    boxShadow:
      "0 8px 22px rgba(0,0,0,0.55), inset 0 1px 3px rgba(255,255,255,0.15)",

    transition: "all 0.22s ease",
    cursor: "default",
  },

  // ⭐ ESTILO PARA CLASIFICADOS
  cardQualified: {
    border: "1px solid #00ff9a",
    background:
      "linear-gradient(135deg, rgba(0,255,150,0.25), rgba(0,255,150,0.10))",
    boxShadow: "0 0 14px rgba(0,255,150,0.45)",
    transform: "scale(1.015)",
  },

  // ⭐ NUEVO: COPA / TACHITA
  statusIcon: {
    position: "absolute",
    top: "8px",
    right: "12px",
    fontSize: "22px",
    opacity: 0.9,
  },

  medal: {
    position: "absolute",
    top: "-14px",
    left: "-14px",
    fontSize: "30px",
  },

  logo: {
    width: "70px",
    height: "70px",
    borderRadius: "8px",
    objectFit: "contain",
  },

  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },

  name: {
    fontSize: "17px",
    fontWeight: 700,
    color: "white",
    lineHeight: 1.25,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  meta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "6px",
    opacity: 0.85,
  },

  flag: {
    width: "22px",
    height: "14px",
    borderRadius: "3px",
    objectFit: "cover",
  },

  country: {
    fontSize: "12px",
    letterSpacing: "0.05em",
    color: "white",
  },

  score: {
    fontSize: "26px",
    fontWeight: 800,
    color: "#ffebee",
    minWidth: "40px",
    textAlign: "right",
  },
};
