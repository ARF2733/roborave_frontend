import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function JudgeSelect() {
  const navigate = useNavigate();

  // Bloqueo sin PIN
  useEffect(() => {
    const token = localStorage.getItem("judgeToken");
    if (!token) navigate("/judge");
  }, [navigate]);

  const categories = [
    { id: "A-MAZE-ING", label: "a-MAZE-ing", path: "/judge/amaze" },
    { id: "SUMOBOT", label: "SumoBot", path: "/judge/sumobot" },
    // Si agregas más disciplinas, solo añádelas aquí:
    // { id: "SOCCER", label: "Soccer Futbol", path: "/judge/soccer" },
  ];

  return (
    <div style={styles.root}>
      {/* Animación global */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div style={styles.panel}>
        <h1 style={styles.title}>Zona de Jueces</h1>
        <p style={styles.subtitle}>Selecciona la disciplina que vas a juzgar</p>

        <div style={styles.grid}>
          {categories.map((c) => (
            <div
              key={c.id}
              style={styles.card}
              onClick={() => navigate(c.path)}
            >
              <div style={styles.cardTitle}>{c.label}</div>
            </div>
          ))}
        </div>

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.removeItem("judgeToken");
            navigate("/judge");
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* -------------------- ESTILOS ---------------------- */
/* -------------------------------------------------- */

const styles = {
  root: {
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(circle at 50% -40vh, #262626 0, #0b0b0b 45%, #000 100%)",
    padding: 20,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  panel: {
    width: "100%",
    maxWidth: "520px",
    padding: "34px 32px 40px",
    background: "rgba(20,20,20,0.88)",
    borderRadius: "22px",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.8)",
    animation: "fadeUp .5s ease-out",
    textAlign: "center",
  },

  title: {
    fontSize: "28px",
    fontWeight: 900,
    color: "white",
    letterSpacing: "0.06em",
    marginBottom: "6px",
  },

  subtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: "14px",
    marginBottom: "28px",
  },

  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  card: {
    padding: "18px 20px",
    borderRadius: "16px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "17px",
    letterSpacing: "0.04em",
    transition: "all 0.22s ease",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: 800,
  },

  logout: {
    marginTop: "28px",
    padding: "12px 20px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "white",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
