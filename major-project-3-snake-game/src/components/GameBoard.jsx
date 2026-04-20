import useGame from '../hooks/useGame';
import { GRID_SIZE } from '../constants';

export default function GameBoard() {
  const { gameState } = useGame();
  const { snake, food } = gameState;
  const totalCells = GRID_SIZE * GRID_SIZE;

  return (
    <div
      className="game-board"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
      }}
    >
      {Array.from({ length: totalCells }).map((_, i) => {
        const x = i % GRID_SIZE;
        const y = Math.floor(i / GRID_SIZE);

        const isSnake = snake.some((seg) => seg.x === x && seg.y === y);
        const isFood = food.x === x && food.y === y;

        return (
          <div
            key={i}
            style={{
              width: 20,
              height: 20,
              background: isSnake ? 'limegreen' : isFood ? 'red' : '#111',
              border: '1px solid #222',
            }}
          />
        );
      })}
    </div>
  );
}
