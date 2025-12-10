import { useState } from "react";

export default function Home() {
  const [hover, setHover] = useState(null);

  return (
    <>
      {/* Animaciones globales */}
      <style>{`
        @keyframes panelIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <div style={styles.root}>
        {/* PANEL */}
        <div style={styles.panel}>
          {/* LOGO */}
          <img
            src="/roborave_logo_white.svg"
            alt="RoboRAVE"
            style={styles.logo}
          />

          {/* TÍTULOS */}
          <div style={styles.title}>MEXICO 2025</div>
          <div style={styles.subtitle}>LIVE SCORE SYSTEM</div>

          {/* BOTONES */}
          <a
            href="/scores"
            style={{
              ...styles.button,
              ...(hover === "scores" ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setHover("scores")}
            onMouseLeave={() => setHover(null)}
          >
            Preliminares
          </a>

          <a
            href="/finals"
            style={{
              ...styles.button,
              ...(hover === "finals" ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setHover("finals")}
            onMouseLeave={() => setHover(null)}
          >
            RoboRAVE Finals
          </a>

          <a
            href="/judge"
            style={{
              ...styles.button,
              ...(hover === "judge" ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setHover("judge")}
            onMouseLeave={() => setHover(null)}
          >
            Zona de Jueces
          </a>

          <a
            href="/tv"
            style={{
              ...styles.button,
              ...(hover === "tv" ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setHover("tv")}
            onMouseLeave={() => setHover(null)}
          >
            RoboRAVE TV (PPV)
          </a>
        </div>
      </div>
    </>
  );
}

const styles = {
  root: {
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(circle at 50% -40vh, #262626 0, #0b0b0b 45%, #000 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    boxSizing: "border-box",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    color: "white",
  },

  panel: {
    width: "100%",
    maxWidth: "520px",
    padding: "34px 30px 30px",
    borderRadius: "22px",
    background:
      "linear-gradient(145deg, rgba(18,18,18,0.96), rgba(5,5,5,0.98))",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow:
      "0 18px 45px rgba(0,0,0,0.85), 0 0 40px rgba(0,0,0,0.7)",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "22px",
    textAlign: "center",

    animation: "panelIn 0.55s ease-out",
  },

  logo: {
    height: "72px",
    objectFit: "contain",
    filter:
      "drop-shadow(0 0 6px rgba(255,255,255,0.25)) drop-shadow(0 0 16px rgba(255,255,255,0.18))",
    marginBottom: "-4px",
  },

  title: {
    fontSize: "24px",
    fontWeight: 800,
    letterSpacing: "0.20em",
    color: "#ffebee",
    marginTop: "4px",
  },

  subtitle: {
    fontSize: "13px",
    letterSpacing: "0.14em",
    opacity: 0.78,
    marginTop: "-16px",
    marginBottom: "6px",
  },

  button: {
    width: "100%",
    padding: "15px",
    borderRadius: "14px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "#f5f5f5",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textAlign: "center",
    boxShadow: "0 5px 16px rgba(0,0,0,0.55)",
    transition: "all 0.22s ease",
    cursor: "pointer",
  },

  buttonHover: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
    borderColor: "rgba(255,255,255,0.35)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 22px rgba(0,0,0,0.75)",
  },
};
