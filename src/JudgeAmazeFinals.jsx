import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fallbackTeams } from "./fallbackTeams";

export default function JudgeAmazeFinals() {
  const navigate = useNavigate();
  const token = localStorage.getItem("judgeToken");

  const [teams, setTeams] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Cargar solo A-MAZE-ing
    const amazeTeams = fallbackTeams.filter(t =>
      t.category.startsWith("A-MAZE-ING")
    );
    setTeams(amazeTeams);
  }, []);

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
  async function generateFinalBracket(category) {
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

      <h1 style={styles.title}>a-MAZE-ing</h1>

      <p style={styles.subtitle}>
        Selecciona qué categoría deseas enviar a finales.
      </p>

      <div style={styles.list}>
        {teams
          .reduce((acc, t) => {
            acc.add(t.category);
            return acc;
          }, new Set())
          .forEach}

        {[...new Set(teams.map(t => t.category))].map(cat => (
          <div key={cat} style={styles.card}>
            <div style={styles.catName}>{formatCategory(cat)}</div>

            <button
              style={styles.buttonPrimary}
              onClick={() => generateFinalBracket(cat)}
            >
              Generar Finales
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------- FORMATTER ------------------------ */
function formatCategory(cat) {
  const map = {
    "A-MAZE-ING_ES": "a-MAZE-ing • ES",
    "A-MAZE-ING_MS": "a-MAZE-ing • MS",
  };
  return map[cat] || cat;
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
    flexDirection: "column",
    gap: "20px",
    maxWidth: "480px",
    margin: "0 auto",
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
    animation: "fadeInScale .25s ease-out",
  },

  toastSuccess: {
    background: "rgba(0, 200, 83, 0.85)",
  },

  toastError: {
    background: "rgba(200, 0, 0, 0.85)",
  },
};
