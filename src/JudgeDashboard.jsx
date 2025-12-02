import { useState } from "react";
import { fallbackTeams } from "./fallbackTeams"; // importa tu archivo

export default function JudgeDashboard() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [score, setScore] = useState("");

  const openModal = (team) => {
    setSelectedTeam(team);
    setScore("");
  };

  const submitScore = async () => {
    if (!selectedTeam || !score) {
      alert("Completa el puntaje");
      return;
    }

    await fetch("https://roborave.onrender.com/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: selectedTeam.id,
        category: selectedTeam.category,
        heat: 1, // puedes cambiarlo después
        score: {
          points: Number(score),
        },
      }),
    });

    alert("Puntaje registrado");

    setSelectedTeam(null);
    setScore("");
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Panel de Juez</h1>

      {/* LISTA DE EQUIPOS */}
      <div style={{ marginTop: 20 }}>
        {fallbackTeams.map((team) => (
          <div
            key={team.id}
            onClick={() => openModal(team)}
            style={{
              padding: 15,
              marginBottom: 12,
              background: "#f3f3f3",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            <strong>{team.name}</strong>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {team.category}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedTeam && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex", justifyContent: "center", alignItems: "center",
          }}
        >
          <div style={{ background: "white", padding: 30, borderRadius: 10 }}>
            <h2>{selectedTeam.name}</h2>

            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Puntaje"
              style={{
                padding: 12, width: "100%", marginTop: 20, borderRadius: 8,
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
                padding: 10,
                width: "100%",
                background: "#ccc",
                borderRadius: 8,
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
