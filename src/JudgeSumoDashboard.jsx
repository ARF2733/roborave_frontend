import { useNavigate } from "react-router-dom";

export default function JudgeSumoDashboard() {
  const navigate = useNavigate();

  function goPrelims() {
    navigate("/judge/sumo/prelims");
  }

  function goFinals() {
    navigate("/judge/sumo/finals");
  }

  return (
    <div style={styles.root}>
      <img
        src="/roborave_logo_white.svg"
        alt="RoboRAVE"
        style={styles.logo}
      />

      <h2 style={styles.title}>SumoBot</h2>

      <div style={styles.buttonsWrapper}>
        <button
          style={{ ...styles.button, ...styles.buttonLight }}
          onClick={goPrelims}
        >
          Preliminares
        </button>

        <button
          style={{ ...styles.button, ...styles.buttonDark }}
          onClick={goFinals}
        >
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

  /* ------------------- CUADRADOS ------------------- */
  buttonsWrapper: {
    display: "flex",
    flexDirection: "row",
    gap: "26px",
    justifyContent: "center",
  },

  button: {
    width: "180px",
    height: "180px",
    borderRadius: "18px",
    fontSize: "18px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all .25s ease",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
  },


  buttonLight: {
    background: "linear-gradient(135deg, #00000088, #ffffff72)",
    color: "white",
    border: "1px solid rgba(0, 0, 0, 0.58)",
  },

  buttonDark: {
    background: "linear-gradient(135deg, #00000088, #ef2727c9)",
    color: "white",
    border: "1px solid rgba(0, 0, 0, 0.58)",
  },
};

