export default function LiveHeatsGrid({ teams }) {
  return (
    <div style={styles.grid}>
      {teams.map((t) => (
        <div key={t.id} style={styles.card}>

          {/* LOGO */}
          <img
            src={`/logos/${t.logo}`}
            alt={t.name}
            style={styles.logo}
          />

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

          {/* SCORE — ¡Aquí vuelve el número! */}
          <div style={styles.score}>
            {t.score}
          </div>

        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "100%",
  },

  card: {
    background: "rgba(255, 255, 255, 0.18)",
    borderRadius: "12px",
    padding: "14px 16px",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",

    border: "1px solid rgba(255,255,255,0.22)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",

    boxShadow: "0 3px 10px rgba(0,0,0,0.35)",
    transition: "transform 0.15s ease",
  },

  logo: {
    width: "75px",
    height: "75px",
    borderRadius: "6px",
    objectFit: "contain",
    flexShrink: 0,
  },

  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },

  name: {
    fontSize: "15px",
    fontWeight: 600,
    color: "white",
    whiteSpace: "normal",
    lineHeight: 1.25,

    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  meta: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "4px",
    opacity: 0.85,
  },

  flag: {
    width: "20px",
    height: "13px",
    borderRadius: "3px",
    objectFit: "cover",
    flexShrink: 0,
  },

  country: {
    fontSize: "12px",
    letterSpacing: "0.04em",
    color: "white",
  },

  score: {
    fontSize: "24px",
    fontWeight: 800,
    color: "white",
    marginLeft: "10px",
    minWidth: "32px",
    textAlign: "right",
    flexShrink: 0,
  },
};
