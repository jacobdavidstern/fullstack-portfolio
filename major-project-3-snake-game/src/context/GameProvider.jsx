import { useState } from 'react';
import { GameContext } from './GameContext';
import { INITIAL_GAME_STATE } from '../constants';

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);

  // Reset the entire game back to its initial state
  function resetGame() {
    setGameState(INITIAL_GAME_STATE);
  }

  return (
    <GameContext.Provider value={{ gameState, setGameState, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}
