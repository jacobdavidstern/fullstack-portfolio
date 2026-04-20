export default function Leaderboard({ scores }) {
  // Make a sorted copy (never mutate props)
  const sorted = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        {sorted.map((s, i) => (
          <li key={i}>
            {s.name}: {s.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
