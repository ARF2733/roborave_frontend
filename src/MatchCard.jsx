export default function MatchCard({ match }) {
  const { teamA, teamB, winner } = match;

  function selectWinner(id) {
    match.winner = id;
  }

  return (
    <div className="match">
      <TeamCard team={teamA} isWinner={winner === teamA.id} onClick={() => selectWinner(teamA.id)} />
      <div className="vs">VS</div>
      <TeamCard team={teamB} isWinner={winner === teamB.id} onClick={() => selectWinner(teamB.id)} />
    </div>
  );
}
