import { useGameContext } from '../hooks/useGameContext';
import formatDuration from '../utils/formatDuration';

export default function ScoreDisplay({ timeLeft }) {
  const { gameState } = useGameContext();
  const { score } = gameState;

  return (
    <div className="hud">
      <div className="score">Score: {score}</div>
      <div className="time">Time left: {formatDuration(timeLeft)}</div>
    </div>
  );
}
