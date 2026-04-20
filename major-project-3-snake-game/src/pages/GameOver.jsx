import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameContext } from '../hooks/useGameContext';
import Leaderboard from '../components/Leaderboard';
import useQuote from '../hooks/useQuote';

export default function GameOver({ scores, addScore }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { resetGame } = useGameContext();

  const { quote, loading } = useQuote();
  const finalScore = state?.score ?? 0;
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);

  function handleSubmit() {
    addScore({
      name: playerName.trim() || 'Anonymous',
      score: finalScore,
    });
    setSaved(true);
  }

  function handlePlayAgain() {
    resetGame();
    navigate('/game');
  }

  return (
    <div className="container">
      <div className="game-over">
        <h1>Game Over</h1>

        <p className="quote">{loading ? 'Loading wisdom...' : quote}</p>

        <p>Your Score: {finalScore}</p>

        {!saved && (
          <>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              maxLength={10}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button onClick={handleSubmit}>Save Score</button>
          </>
        )}

        {saved && <Leaderboard scores={scores} />}

        <button onClick={handlePlayAgain}>Play Again</button>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );
}
