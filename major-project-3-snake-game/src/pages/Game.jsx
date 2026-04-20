import GameBoard from '../components/GameBoard';
import { useGameContext } from '../hooks/useGameContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useTimer from '../hooks/useTimer';
import formatDuration from '../utils/formatDuration';

export default function Game() {
  const { gameState } = useGameContext();
  const { score } = gameState; // <-- you need this
  const navigate = useNavigate();

  const { timeLeft, start, stop } = useTimer(180);

  useEffect(() => {
    start();
    return () => stop();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/gameover', { state: { score } });
    }
  }, [timeLeft, navigate, score]);

  useEffect(() => {
    if (gameState.isGameOver) {
      navigate('/gameover', { state: { score } });
    }
  }, [gameState.isGameOver, score, navigate]);

  return (
    <div className="container">
      <div className="hud">
        <div className="score">Score: {score}</div>
        <div className="time">Time left: {formatDuration(timeLeft)}</div>
      </div>

      <GameBoard />
    </div>
  );
}
