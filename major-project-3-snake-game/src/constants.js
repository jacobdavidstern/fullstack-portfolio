export const GRID_SIZE = 25;
export const INITIAL_SPEED = 133;
// 1000ms/150ms ≈ 7.5 renders per second

export const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

// Extract the initial state here
export const INITIAL_GAME_STATE = {
  snake: [
    { x: 10, y: 10 }, // head
    { x: 9, y: 10 }, // middle
    { x: 8, y: 10 }, // tail
  ],
  direction: DIRECTIONS.ArrowRight, // use constants
  food: { x: 5, y: 5 },
  score: 0,
  isGameOver: false,
};
