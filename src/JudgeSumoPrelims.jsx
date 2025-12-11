import { useEffect, useState } from "react";
import { fallbackTeams } from "./fallbackTeams";

export default function JudgeSumoPrelims() {
  const [rounds, setRounds] = useState([]); // 3 rondas generadas
  const [serverScores, setServerScores] = useState([]); // <- puntajes reales
  const token = localStorage.getItem("judgeToken");

  /* ---------------------------------------------------
        LEER SCORES REALES DEL BACKEND
  --------------------------------------------------- */
  async function loadScores() {
    try {
      const r = await fetch("https://roborave.onrender.com/api/scores");
      const json = await r.json();
      setServerScores(json.teams || []);
    } catch (e) {
      console.log("No se pudieron cargar scores");
    }
  }

  useEffect(() => {
    loadScores();
  }, []);

  /* ---------------------------------------------------
        OBTENER PUNTAJE TOTAL DEL SERVIDOR
  --------------------------------------------------- */
  function getTotal(team) {
    const found = serverScores.find((t) => t.teamId === team.id);
    if (!found || !found.heats) return 0;

    return Object.values(found.heats).reduce(
      (sum, h) => sum + (h.points || 0),
      0
    );
  }

  /* ---------------------------------------------------
        REGISTRAR GANADOR (cada heat vale 3 puntos)
  --------------------------------------------------- */
  async function registerWin(team, heat) {
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
          heat,
          score: { points: 3 },
        }),
      });

      const json = await r.json();
      if (!json.ok) {
        console.log("Error registrando puntuación");
        return;
      }

      await loadScores(); // ← ¡Actualiza los totales inmediatamente!
    } catch (err) {
      console.log("Error de conexión");
    }
  }

  /* ---------------------------------------------------
        GENERAR 3 RONDAS ALEATORIAS
  --------------------------------------------------- */
  function generateRounds() {
    const sumoTeams = fallbackTeams.filter((t) => t.category === "SUMO_ES");
    const shuffled = [...sumoTeams].sort(() => Math.random() - 0.5);

    const pairs = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      if (shuffled[i + 1]) {
        pairs.push({
          a: shuffled[i],
          b: shuffled[i + 1],
          winner: null,
        });
      }
    }

    setRounds([[...pairs], [...pairs], [...pairs]]);
  }

  /* ---------------------------------------------------
        ACTUALIZAR GANADOR EN UI Y REGISTRAR PUNTOS
  --------------------------------------------------- */
  function setWinner(roundIdx, matchIdx, winnerId) {
    const heat = roundIdx + 1; // heat 1, 2 o 3

    setRounds((prev) =>
      prev.map((rnd, r) =>
        r === roundIdx
          ? rnd.map((m, mi) =>
              mi === matchIdx ? { ...m, winner: winnerId } : m
            )
          : rnd
      )
    );

    const match = rounds[roundIdx][matchIdx];
    const winnerTeam =
      match.a.id === winnerId ? match.a : match.b;

    registerWin(winnerTeam, heat);
  }

  return (
    <div style={styles.root}>
      <h1 style={styles.title}>SumoBot</h1>

      <button style={styles.button} onClick={generateRounds}>
        Random
      </button>

      {/* Mostrar rondas */}
      {rounds.length > 0 &&
        rounds.map((round, idx) => (
          <RoundCard
            key={idx}
            number={idx + 1}
            matches={round}
            roundIndex={idx}
            getTotal={getTotal}
            onSelectWinner={setWinner}
          />
        ))}
    </div>
  );
}

/* ---------------------------------------------------
      COMPONENTE RONDA
--------------------------------------------------- */
function RoundCard({ number, matches, roundIndex, getTotal, onSelectWinner }) {
  return (
    <div style={styles.roundBlock}>
      <h2 style={styles.roundTitle}>Ronda {number}</h2>

      <div style={styles.matchesGrid}>
        {matches.map((m, i) => (
          <MatchCard
            key={i}
            match={m}
            matchIndex={i}
            roundIndex={roundIndex}
            getTotal={getTotal}
            onSelectWinner={onSelectWinner}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------
      COMPONENTE MATCH
--------------------------------------------------- */
function MatchCard({ match, matchIndex, roundIndex, getTotal, onSelectWinner }) {
  const { a, b, winner } = match;

  return (
    <div style={styles.matchCard}>
      <TeamCard
        team={a}
        total={getTotal(a)}
        active={winner === a.id}
        onClick={() => onSelectWinner(roundIndex, matchIndex, a.id)}
      />

      <div style={styles.vs}>VS</div>

      <TeamCard
        team={b}
        total={getTotal(b)}
        active={winner === b.id}
        onClick={() => onSelectWinner(roundIndex, matchIndex, b.id)}
      />
    </div>
  );
}

/* ---------------------------------------------------
      COMPONENTE TEAM CARD
--------------------------------------------------- */
function TeamCard({ team, total, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.teamCard,
        ...(active ? styles.teamActive : styles.teamInactive),
      }}
    >
      <img src={`/logos/${team.logo}`} style={styles.logo} />
      <div style={styles.teamName}>{team.name}</div>
      <div style={styles.points}>Total: {total}</div>
    </div>
  );
}

/* ---------------------------------------------------
      ESTILOS
--------------------------------------------------- */

const styles = {
  root: {
    padding: "40px",
    textAlign: "center",
    color: "white",
  },

  title: {
    fontSize: "32px",
    fontWeight: 900,
    marginBottom: "24px",
  },

  button: {
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    cursor: "pointer",
    marginBottom: "30px",
  },

  roundBlock: {
    marginBottom: "40px",
  },

  roundTitle: {
    fontSize: "26px",
    marginBottom: "18px",
  },

  matchesGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
  },

  matchCard: {
    background: "rgba(255,255,255,0.07)",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    minWidth: "360px",
    justifyContent: "space-between",
    border: "1px solid rgba(255,255,255,0.15)",
  },

  vs: {
    fontSize: "20px",
    fontWeight: 900,
  },

  teamCard: {
    width: "140px",
    padding: "10px",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
  },

  teamActive: {
    background: "rgba(0,255,150,0.25)",
    border: "1px solid #00ff9a",
    transform: "scale(1.05)",
  },

  teamInactive: {
    opacity: 0.7,
  },

  logo: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "8px",
  },

  teamName: {
    fontSize: "14px",
    fontWeight: 700,
    marginBottom: "6px",
  },

  points: {
    fontSize: "13px",
    opacity: 0.9,
  },
};
