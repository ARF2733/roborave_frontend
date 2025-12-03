import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fallbackTeams } from "./fallbackTeams";

export default function JudgeDashboard() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState(fallbackTeams);
  const [filteredCategory, setFilteredCategory] = useState("ALL");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [score, setScore] = useState("");

  // Extraer categorías únicas
  const categories = [
    "ALL",
    ...Array.from(new Set(fallbackTeams.map((t) => t.category))),
  ];

  // --------------------------------------------------
  // BLOQUEO DE RUTA SIN TOKEN
  // --------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("judgeToken");
    if (!token) {
      alert("No autorizado");
      navigate("/judge");
    }
  }, []);

  // --------------------------------------------------
  // FILTRAR EQUIPOS
  // --------------------------------------------------
  const filteredTeams =
    filteredCategory === "ALL"
      ? teams
      : teams.filter((t) => t.category === filteredCategory);

  // --------------------------------------------------
  // ABRIR MODAL
  // --------------------------------------------------
  const openModal = (team) => {
    setSelectedTeam(team);
    setScore("");
  };

  // --------------------------------------------------
  // ENVIAR SCORE
  // --------------------------------------------------
  const submitScore = async () => {
    if (!selectedTeam || !score) {
      alert("Falta puntaje");
      return;
    }

    const token = localStorage.getItem("judgeToken");

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
      alert("Error enviando puntaje");
      return;
    }

    alert("Puntaje registrado");
    setSelectedTeam(null);
    setScore("");
  };

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        <h1 style={styles.title}>Panel de Jueces</h1>

        {/* FILTRO DE CATEGORÍAS */}
        <div style={styles.filterWrapper}>
          {/* Fade izquierda */}
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
                {cat}{" "}
                {cat !== "ALL" &&
                  `(${teams.filter((t) => t.category === cat).length})`}
              </div>
            ))}
          </div>

          {/* Fade derecha */}
          <div style={styles.fadeRight} />
        </div>

        {/* GRID PREMIUM */}
        <div style={styles.grid}>
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="score-card"
              onClick={() => openModal(team)}
              style={styles.teamCard}
            >
              <div style={styles.teamName}>{team.name}</div>
              <div style={styles.category}>{team.category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL PREMIUM */}
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
    </div>
  );
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
    marginBottom: "6px",
  },

  /* Filtro */
  filterWrapper: {
    position: "relative",
    width: "100%",
    marginTop: "-4px",
    marginBottom: "6px",
  },

  filterBar: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    padding: "8px 0",
    paddingTop: "6px",
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch",
  },

  filterChip: {
    padding: "8px 14px",
    background: "rgba(255,255,255,0.10)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "white",
    fontSize: "13px",
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition: "0.2s ease",
    scrollSnapAlign: "start",
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
    zIndex: 5,
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
    zIndex: 5,
  },

  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  teamCard: {
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    borderRadius: "14px",
    padding: "18px 20px",
    cursor: "pointer",
    transition: "0.22s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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

  /* Modal */
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
    padding: 20,
  },

  modal: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(20,20,20,0.9)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "18px",
    padding: "28px",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    animation: "fadeIn 0.25s ease",
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
    outline: "none",
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
};
  