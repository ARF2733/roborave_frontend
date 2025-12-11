import { useNavigate } from "react-router-dom";

export default function JudgeAmazeDashboard() {
  const navigate = useNavigate();

  function goPrelims() {
    navigate("/judge/amaze/prelims");
  }

  function goFinals() {
    navigate("/judge/amaze/finals");
  }

  return (
    <div style={styles.root}>
      <img
        src="/roborave_logo_white.svg"
        alt="RoboRAVE"
        style={styles.logo}
      />

      <h2 style={styles.title}>a-MAZE-ing</h2>

      <div style={styles.buttonsWrapper}>
        <button style={{ ...styles.button, ...styles.buttonLight }} onClick={goPrelims}>
          Preliminares
        </button>

        <button style={{ ...styles.button, ...styles.buttonDark }} onClick={goFinals}>
          Finales
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* ESTILOS — Minimal Pro, elegante, neutro */
/* -------------------------------------------------- */

const styles = {
  root: {
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(circle at 50% -40vh, #1c1c1c 0, #0d0d0d 45%, #000 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    color: "white",
    textAlign: "center",
  },

  logo: {
    height: "72px",
    marginBottom: "20px",
    opacity: 0.9,
    filter: "drop-shadow(0 0 4px rgba(255,255,255,0.15))",
  },

  title: {
    fontSize: "24px",
    fontWeight: 800,
    letterSpacing: "0.14em",
    marginBottom: "46px",
    opacity: 0.9,
  },

  buttonsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    maxWidth: "420px",
  },

  button: {
    padding: "18px",
    borderRadius: "16px",
    fontSize: "18px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all .25s ease",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.18)",
  },

  buttonLight: {
    background: "rgba(255,255,255,0.12)",
    color: "white",
  },

  buttonDark: {
    background: "rgba(255,255,255,0.06)",
    color: "white",
  },
};
