import { useEffect, useState } from "react";
import { fallbackTeams } from "./fallbackTeams";

export default function JudgeAmazePrelims() {
  const [teams, setTeams] = useState([]);
  const [scores, setScores] = useState({});
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("judgeToken");

  // -----------------------------
  // LOAD ONLY A-MAZE-ing TEAMS
  // -----------------------------
  useEffect(() => {
    const amazeTeams = fallbackTeams.filter(t =>
      t.category.startsWith("A-MAZE-ING")
    );
    setTeams(amazeTeams);
  }, []);

  // -----------------------------
  // TOAST PREMIUM
  // -----------------------------
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // -----------------------------
  // HANDLE SCORE INPUT
  // -----------------------------
  const updateScore = (id, value) => {
    setScores((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // -----------------------------
  // SUBMIT SCORE
  // -----------------------------
  const submitScore = async (team) => {
    const value = scores[team.id];

    if (!value) {
      showToast("Ingresa un puntaje", "error");
      return;
    }

    try {
      const r = await fetch("https://roborave.onrender.com/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          teamId: team.id,
          category: team.category,
          heat: 1,
          score: { points: Number(value) },
        }),
      });

      const json = await r.json();

      if (!json.ok) {
        showToast(json.error || "Error registrando puntaje", "error");
        return;
      }

      showToast("Puntaje registrado");
    } catch (err) {
      showToast("Error de conexión", "error");
    }
  };

  return (
    <div style={styles.root}>

      {/* ---------------- TOAST ---------------- */}
      {toast && (
        <div
          style={{
            ...styles.toast,
            ...(toast.type === "error"
              ? styles.toastError
              : styles.toastSuccess),
          }}
        >
          {toast.message}
        </div>
      )}

      <h1 style={styles.title}>Preliminares • a-MAZE-ing</h1>

      <div style={styles.list}>
        {teams.map((team) => (
          <div key={team.id} style={styles.card}>
            <div style={styles.header}>
              <img
                src={`/logos/${team.logo}`}
                alt=""
                style={styles.logo}
              />
              <div>
                <div style={styles.teamName}>{team.name}</div>
                <div style={styles.category}>{team.category}</div>
              </div>
            </div>

            <input
              type="number"
              placeholder="Puntaje"
              value={scores[team.id] || ""}
              onChange={(e) => updateScore(team.id, e.target.value)}
              style={styles.input}
            />

            <button
              onClick={() => submitScore(team)}
              style={styles.buttonPrimary}
            >
              Registrar Puntaje
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* ------------------- ESTILOS ---------------------- */
/* -------------------------------------------------- */

const styles = {
  root: {
    width: "100vw",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% -40vh, #1d1d1d 0, #0a0a0a 45%, #000 100%)",
    padding: "40px 20px",
    color: "white",
  },

  title: {
    fontSize: "26px",
    textAlign: "center",
    fontWeight: 800,
    marginBottom: "40px",
    letterSpacing: "0.08em",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "600px",
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
    gap: "16px",
  },

  header: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },

  logo: {
    width: "60px",
    height: "60px",
    borderRadius: "14px",
    objectFit: "cover",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.25)",
  },

  teamName: {
    fontSize: "18px",
    fontWeight: 700,
  },

  category: {
    fontSize: "13px",
    opacity: 0.7,
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "white",
    fontSize: "17px",
  },

  buttonPrimary: {
    padding: "14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "white",
    fontSize: "17px",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "center",
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
    textAlign: "center",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
    zIndex: 99999,
    minWidth: "220px",
    maxWidth: "80vw",
    opacity: 0.95,
    animation: "fadeInScale .25s ease-out",
  },

  toastSuccess: {
    background: "rgba(0, 200, 83, 0.85)",
  },

  toastError: {
    background: "rgba(200, 0, 0, 0.85)",
  },
};
