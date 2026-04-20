import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Leaderboard from '../components/Leaderboard';

export default function Home({ scores, resetScores }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // hooks before jsx

  return (
    <div className="container">
      <div className="home">
        <h1>Snake ... Ain't no Fang</h1>
        <p>Use arrow keys to move. Eat food. Don’t crash.</p>

        <button onClick={() => navigate('/game')}>Start Game</button>

        <button onClick={() => setOpen((o) => !o)}>
          {open ? 'Hide Leaderboard' : 'Show Leaderboard'}
        </button>

        {open && <Leaderboard scores={scores} />}

        <button onClick={resetScores}>Reset Leaderboard</button>
      </div>
    </div>
  );
}
