import { useState } from "react";
import { fallbackTeams } from "./fallbackTeams";

export default function JudgePrelims() {
  const [rounds, setRounds] = useState([]); // 3 rondas generadas

  /* ---------------------------------------------------
     GENERAR 3 RONDAS ALEATORIAS
  --------------------------------------------------- */
  function generateRounds() {
  // 1) Filtrar solo equipos de SUMO
  const sumoTeams = fallbackTeams.filter(t => t.category === "SUMO_ES");

  // 2) Mezclar aleatoriamente
  const shuffled = [...sumoTeams].sort(() => Math.random() - 0.5);

  // 3) Emparejar de 2 en 2
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

  // 4) Guardar las 3 rondas
  setRounds([
    [...pairs],
    [...pairs],
    [...pairs],
   ]);
  }


  /* ---------------------------------------------------
     ACTUALIZAR GANADOR (reactivo)
  --------------------------------------------------- */
  function setWinner(roundIdx, matchIdx, winnerId) {
    setRounds(prev =>
      prev.map((rnd, r) =>
        r === roundIdx
          ? rnd.map((m, mi) =>
              mi === matchIdx ? { ...m, winner: winnerId } : m
            )
          : rnd
      )
    );
  }

  return (
    <div style={styles.root}>
      <h1 style={styles.title}>Preliminares — SumoBot</h1>

      <button style={styles.button} onClick={generateRounds}>
        Generar 3 Rondas Aleatorias
      </button>

      {/* Mostrar rondas */}
      {rounds.length > 0 &&
        rounds.map((round, idx) => (
          <RoundCard
            key={idx}
            number={idx + 1}
            matches={round}
            roundIndex={idx}
            onSelectWinner={setWinner}
          />
        ))}

      {/* Botón final */}
      {rounds.length > 0 && (
        <button style={styles.finalButton}>
          Finalizar Preliminares y Ordenar Finalistas
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------
   RONDA
--------------------------------------------------- */
function RoundCard({ number, matches, roundIndex, onSelectWinner }) {
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
            onSelectWinner={onSelectWinner}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   MATCH
--------------------------------------------------- */
function MatchCard({ match, matchIndex, roundIndex, onSelectWinner }) {
  const { a, b, winner } = match;

  return (
    <div style={styles.matchCard}>
      <TeamCard
        team={a}
        active={winner === a.id}
        onClick={() => onSelectWinner(roundIndex, matchIndex, a.id)}
      />

      <div style={styles.vs}>VS</div>

      <TeamCard
        team={b}
        active={winner === b.id}
        onClick={() => onSelectWinner(roundIndex, matchIndex, b.id)}
      />
    </div>
  );
}

/* ---------------------------------------------------
   TEAM CARD
--------------------------------------------------- */
function TeamCard({ team, active, onClick }) {
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
    fontFamily: "system-ui",
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

  finalButton: {
    padding: "14px 26px",
    fontSize: "18px",
    borderRadius: "14px",
    background: "linear-gradient(90deg, #ff0084, #ff6600)",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginTop: "40px",
    fontWeight: 800,
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
    width: "120px",
    padding: "10px",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  teamActive: {
    background: "rgba(0,255,150,0.25)",
    border: "1px solid #00ff9a",
    transform: "scale(1.05)",
  },

  teamInactive: {
    opacity: 0.6,
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
  },
};
