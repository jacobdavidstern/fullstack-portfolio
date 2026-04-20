import { useEffect, useRef } from 'react';
import { useGameContext } from '../hooks/useGameContext';
import { DIRECTIONS, GRID_SIZE, INITIAL_SPEED } from '../constants';

/**
 * Custom hook to manage the Snake game engine.
 * Handles movement logic, collision detection, and keyboard input synchronization.
 * * @returns {Object} The current game state and a dispatcher to update it.
 */
export default function useGame() {
  const { gameState, setGameState } = useGameContext();

  /**
   * Tracks the direction of the last processed move.
   * Essential for preventing a "180-degree turn" bug where the snake
   * could reverse into itself if two keys are pressed within one tick.
   */
  const lastProcessedDirection = useRef(gameState.direction);

  // Handle keyboard input
  useEffect(() => {
    function handleKeyDown(e) {
      const newDir = DIRECTIONS[e.key];
      if (!newDir) return;

      // Reverse prevention: logic requires checking against the ref
      // to account for the snake's actual physical orientation.
      const isOpposite =
        newDir.x === -lastProcessedDirection.current.x &&
        newDir.y === -lastProcessedDirection.current.y;

      if (!isOpposite) {
        setGameState((prev) => ({ ...prev, direction: newDir }));
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setGameState]);

  /**
   * Core Game Loop
   * Manages snake movement using a queue-based coordinate system:
   * - Movement: Add new head, remove tail.
   * - Growth: Add new head, retain tail.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        if (prev.isGameOver) return prev;

        // Update the ref so the next keypress knows where we are headed
        lastProcessedDirection.current = prev.direction;

        const head = prev.snake[0];
        const newHead = {
          x: head.x + prev.direction.x,
          y: head.y + prev.direction.y,
        };

        const hitSelf = prev.snake.some(
          (seg) => seg.x === newHead.x && seg.y === newHead.y
        );

        if (hitSelf) {
          return {
            ...prev,
            isGameOver: true,
          };
        }

        const hitWall =
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE;

        if (hitWall) {
          return {
            ...prev,
            isGameOver: true,
          };
        }

        const ateFood = newHead.x === prev.food.x && newHead.y === prev.food.y;

        const newSnake = ateFood
          ? [newHead, ...prev.snake] // grow, keep tail end
          : [newHead, ...prev.snake.slice(0, -1)]; // default, lose tail end

        // Generate new food location if snake ate
        const newFood = ateFood
          ? {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE),
            }
          : prev.food;

        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: ateFood ? prev.score + 1 : prev.score,
        };
      });
    }, INITIAL_SPEED);

    return () => clearInterval(interval);
  }, [setGameState]);

  return { gameState, setGameState };
}
