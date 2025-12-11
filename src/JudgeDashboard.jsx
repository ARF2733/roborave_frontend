import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fallbackTeams } from "./fallbackTeams";

export default function JudgeDashboard() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState(fallbackTeams);
  const [filteredCategory, setFilteredCategory] = useState(fallbackTeams[0]?.category || "");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [score, setScore] = useState("");
  const [toast, setToast] = useState(null);

  // Categorías únicas
  const categories = Array.from(
  new Set(fallbackTeams.map((t) => t.category))
);


  // --------------------------------------------------
  // TOAST
  // --------------------------------------------------
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // --------------------------------------------------
  // AUTH BLOCK
  // --------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("judgeToken");
    if (!token) {
      alert("No autorizado");
      navigate("/judge");
    }
  }, [navigate]);

  // --------------------------------------------------
  // FILTER TEAMS
  // --------------------------------------------------
  const filteredTeams = teams.filter(
  (t) => t.category === filteredCategory);


  // --------------------------------------------------
  // OPEN MODAL
  // --------------------------------------------------
  const openModal = (team) => {
    setSelectedTeam(team);
    setScore("");
  };

  // --------------------------------------------------
  // SUBMIT SCORE
  // --------------------------------------------------
  const submitScore = async () => {
    if (!selectedTeam || !score) {
      showToast("Falta puntaje", "error");
      return;
    }

    const token = localStorage.getItem("judgeToken");

    try {
      const r = await fetch("https://roborave.onrender.com/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          teamId: selectedTeam.id,
          category: selectedTeam.category,
          heat: 1,
          score: { points: Number(score) },
        }),
      });

      const json = await r.json();

      if (!json.ok) {
        showToast(json.error || "Error enviando puntaje", "error");
        return;
      }

      showToast("Puntaje registrado");
      setSelectedTeam(null);
      setScore("");
    } catch (err) {
      showToast("Error de conexión", "error");
    }
  };

  // --------------------------------------------------
  // GENERATE BRACKET
  // --------------------------------------------------
  const generateBracket = async () => {
    const token = localStorage.getItem("judgeToken");
    if (!token) {
      showToast("No autorizado", "error");
      return;
    }

    
    try {
      const r = await fetch(
        "https://roborave.onrender.com/api/bracket/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ category: filteredCategory }),
        }
      );

      const json = await r.json();

      if (!json.ok) {
        showToast(json.error || "Error generando bracket", "error");
        return;
      }

      showToast(`Bracket generado para ${formatCategory(filteredCategory)}`);
      navigate("/finals");
    } catch (err) {
      showToast("Error de conexión", "error");
    }
  };

  return (
    <div style={styles.root}>
      {/* ANIMACIÓN GLOBAL */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>

      <div style={styles.container}>
        <h1 style={styles.title}>Panel de Jueces</h1>

        <button
          onClick={() => navigate("/judge/prelims")}
          style={styles.prelimsButton}
        >
          Preliminares
        </button>

        <button onClick={generateBracket} style={styles.bracketButton}>
          Generar Bracket de Finales
        </button>

        {/* CATEGORÍAS */}
        <div style={styles.filterWrapper}>
          <div style={styles.fadeLeft} />
          <div style={styles.filterBar}>
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => setFilteredCategory(cat)}
                style={{
                  ...styles.filterChip,
                  background:
                    filteredCategory === cat
                      ? "rgba(255,255,255,0.22)"
                      : "rgba(255,255,255,0.08)",
                  border:
                    filteredCategory === cat
                      ? "1px solid rgba(255,255,255,0.35)"
                      : "1px solid rgba(255,255,255,0.16)",
                }}
              >
                {cat === "ALL" ? "Todas las categorías" : formatCategory(cat)}{" "}
                {cat !== "ALL" &&
                  `(${teams.filter((t) => t.category === cat).length})`}
              </div>
            ))}
          </div>
          <div style={styles.fadeRight} />
        </div>

        {/* GRID */}
        <div style={styles.grid}>
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="score-card"
              onClick={() => openModal(team)}
              style={styles.teamCard}
            >
              <div style={styles.teamName}>{team.name}</div>
              <div style={styles.category}>
                {formatCategory(team.category)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE SCORE */}
      {selectedTeam && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <div style={styles.modalTitle}>{selectedTeam.name}</div>

            <input
              value={score}
              onChange={(e) => setScore(e.target.value)}
              type="number"
              placeholder="Puntaje"
              style={styles.input}
            />

            <button onClick={submitScore} style={styles.buttonPrimary}>
              Registrar Puntaje
            </button>

            <button
              onClick={() => setSelectedTeam(null)}
              style={styles.buttonSecondary}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* TOAST */}
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
    </div>
  );
}

/* -------------------------------------------------- */
/* --------- FORMAT CATEGORY (MAPA COMPLETO) -------- */
/* -------------------------------------------------- */

function formatCategory(cat) {
  const map = {
    "A-MAZE-ING_ES": "a-MAZE-ing • ES",
    "A-MAZE-ING_MS": "a-MAZE-ing • MS",

    "SUMO_ES": "SumoBot Lego • ES",
    "SUMO_MS": "SumoBot Lego • MS",

    "SUMO1K_ES": "SumoBot 1 Kg • ES",
    "SUMO1K_MS": "SumoBot 1 Kg • MS",
    "SUMO1K_HS": "SumoBot 1 Kg • HS",
    "SUMO1K_UP": "SumoBot 1 Kg • UP",

    "SUMO_OPEN": "SumoBot • OPEN",

    "FIRE_HS": "Fire Fighting • HS",

    "SUMO3K_HS": "SumoBot 3 Kg • HS",
    "SUMO3K_UP": "SumoBot 3 Kg • UP",

    "SOCCER_ES": "Soccer Futbol • ES",
    "SOCCER_MS": "Soccer Futbol • MS",
    "SOCCER_HS": "Soccer Futbol • HS",

    "FAST_MS": "Fastbot • MS",
    "FAST_HS": "Fastbot • HS",
    "FAST_UP": "Fastbot • UP",

    "LINE_HS": "Line Following • HS",

    "ENTRE_HS": "Entrepreneurial • HS",
  };

  return map[cat] || cat;
}

/* -------------------------------------------------- */
/* ------------------- ESTILOS ---------------------- */
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
    overflowY: "auto",
  },

  container: {
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  title: {
    fontSize: "26px",
    fontWeight: 800,
    letterSpacing: "0.12em",
    color: "#ffebee",
    textAlign: "center",
  },

  bracketButton: {
    background: "linear-gradient(90deg, #ff4d4d, #ff1a1a)",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "white",
    fontWeight: 700,
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "center",
    letterSpacing: "0.05em",
    boxShadow: "0 4px 15px rgba(255,0,0,0.25)",
  },

  filterWrapper: {
    position: "relative",
  },

  filterBar: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    padding: "8px 0",
    paddingTop: "6px",
  },

  filterChip: {
    padding: "8px 14px",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
  },

  fadeLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "30px",
    height: "100%",
    background:
      "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0))",
    pointerEvents: "none",
  },

  fadeRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "30px",
    height: "100%",
    background:
      "linear-gradient(to left, rgba(0,0,0,0.85), rgba(0,0,0,0))",
    pointerEvents: "none",
  },

  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  teamCard: {
    background: "rgba(255,255,255,0.10)",
    borderRadius: "14px",
    padding: "18px 20px",
    border: "1px solid rgba(255,255,255,0.15)",
    cursor: "pointer",
  },

  teamName: {
    color: "white",
    fontSize: "17px",
    fontWeight: 700,
  },

  category: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "13px",
  },

  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(20,20,20,0.9)",
    borderRadius: "18px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  modalTitle: {
    fontSize: "20px",
    fontWeight: 700,
    textAlign: "center",
    color: "white",
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
  },

  buttonSecondary: {
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.20)",
    color: "white",
    fontSize: "15px",
    fontWeight: 600,
  },

  prelimsButton: {
    background: "linear-gradient(90deg, #4da6ff, #1a75ff)",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "white",
    fontWeight: 700,
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "center",
    letterSpacing: "0.05em",
    boxShadow: "0 4px 15px rgba(0,80,255,0.25)",
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
    border: "1px solid rgba(255,255,255,0.2)",
  },

  toastError: {
    background: "rgba(200, 0, 0, 0.85)",
    border: "1px solid rgba(255,255,255,0.2)",
  },

};
