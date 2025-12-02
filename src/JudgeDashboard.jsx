import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fallbackTeams } from "./fallbackTeams";

export default function JudgeDashboard() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState(fallbackTeams);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [score, setScore] = useState("");

  // -------------------------------------------
  //  BLOQUEO SI NO HAY TOKEN
  // -------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("judgeToken");
    if (!token) {
      alert("No autorizado");
      navigate("/judge");
    }
  }, []);

  // -------------------------------------------
  // SELECCIONAR EQUIPO
  // -------------------------------------------
  const openModal = (team) => {
    setSelectedTeam(team);
    setScore("");
  };

  // -------------------------------------------
  // ENVIAR SCORE SEGURO
  // -------------------------------------------
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
        "Authorization": token,
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
    <div style={{ padding: 40 }}>
      <h1>Panel de Juez</h1>

      {/* GRID DE EQUIPOS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {teams.map(team => (
          <div
            key={team.id}
            
            style={{
              background: "#eee",
              padding: 16,
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={() => openModal(team)}
          >
            <strong>{team.name}</strong>
            <div>{team.category}</div>
          </div>
        ))}
      </div>

      {/* MODAL PARA PUNTUAR */}
      {selectedTeam && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 12,
              width: "100%",
              maxWidth: 450,
            }}
          >
            <h2>{selectedTeam.name}</h2>

            <input

              value={score}
              onChange={(e) => setScore(e.target.value)}
              type="number"
              placeholder="Puntaje"
              style={{
                padding: 12,
                width: "100%",
                marginTop: 12,
                borderRadius: 8,
                fontSize: 18,
              }}
            />

            <button
              onClick={submitScore}
              style={{
                marginTop: 20,
                padding: 15,
                width: "100%",
                fontSize: 18,
                borderRadius: 8,
              }}
            >
              Registrar Puntaje
            </button>

            <button
              onClick={() => setSelectedTeam(null)}
              style={{
                marginTop: 10,
                padding: 12,
                width: "100%",
                fontSize: 18,
                borderRadius: 8,
                background: "#ccc",
              
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
