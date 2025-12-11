import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JudgeSumoFinals() {
  const navigate = useNavigate();
  const token = localStorage.getItem("judgeToken");

  const [toast, setToast] = useState(null);
  const category = "SUMO_ES";

  // -------------------------
  // TOAST
  // -------------------------
  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  // -------------------------
  // GENERAR BRACKET
  // -------------------------
  async function generateFinalBracket() {
    try {
      const r = await fetch("https://roborave.onrender.com/api/bracket/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ category }),
      });

      const json = await r.json();

      if (!json.ok) {
        showToast(json.error || "Error generando bracket", "error");
        return;
      }

      showToast("Bracket generado");

      // Ir al panel general de finales
      setTimeout(() => navigate("/finals"), 600);

    } catch (e) {
      showToast("Error de conexión", "error");
    }
  }

  return (
    <div style={styles.root}>

      {/* TOAST */}
      {toast && (
        <div
          style={{
            ...styles.toast,
            ...(toast.type === "error" ? styles.toastError : styles.toastSuccess),
          }}
        >
          {toast.msg}
        </div>
      )}

      <h1 style={styles.title}>SumoBot</h1>

      <p style={styles.subtitle}>
        Genera el bracket final para SumoBot.
      </p>

      <div style={styles.list}>
        <div style={styles.card}>
          <div style={styles.catName}>SumoBot • ES</div>

          <button
            style={styles.buttonPrimary}
            onClick={generateFinalBracket}
          >
            Generar Finales
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------- ESTILOS ------------------------- */

const styles = {
  root: {
    width: "100vw",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% -40vh, #1d1d1d 0, #0a0a0a 45%, #000 100%)",
    padding: "40px 20px",
    color: "white",
    textAlign: "center",
  },

  title: {
    fontSize: "28px",
    fontWeight: 900,
    marginBottom: "14px",
  },

  subtitle: {
    opacity: 0.7,
    marginBottom: "32px",
  },

  list: {
    display: "flex",
    justifyContent: "center",
  },

  card: {
    background: "rgba(255,255,255,0.07)",
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 4px 18px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "260px",
  },

  catName: {
    fontSize: "20px",
    fontWeight: 800,
  },

  buttonPrimary: {
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "white",
    fontSize: "17px",
    fontWeight: 700,
    cursor: "pointer",
  },

  toast: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "18px 24px",
    borderRadius: "16px",
    color: "white",
    fontSize: "16px",
    fontWeight: 700,
    backdropFilter: "blur(10px)",
    zIndex: 99999,
  },

  toastSuccess: {
    background: "rgba(0, 200, 83, 0.85)",
  },

  toastError: {
    background: "rgba(200, 0, 0, 0.85)",
  },
};
