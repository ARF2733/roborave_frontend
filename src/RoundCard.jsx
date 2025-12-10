export default function RoundCard({ number, matches }) {
  return (
    <div className="round">
      <h2>Ronda {number}</h2>
      {matches.map((m, idx) => (
        <MatchCard key={idx} match={m} />
      ))}
    </div>
  );
}
