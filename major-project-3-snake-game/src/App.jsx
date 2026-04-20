import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { GameProvider } from './context/GameProvider';

// Pages
import Home from './pages/Home';
import Game from './pages/Game';
import GameOver from './pages/GameOver';

export default function App() {
  const [scores, setScores] = useState([
    { name: 'Snake', score: 1 },
    { name: 'Apple', score: 2 },
  ]);

  function addScore(newScore) {
    const updated = [...scores, newScore];
    setScores(updated);
  }

  function resetScores() {
    setScores([]); // clear React state
    localStorage.removeItem('scores'); // clear persistence
  } // reset Localstorage in console: localStorage.clear();

  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home scores={scores} resetScores={resetScores} />}
          />
          <Route path="/game" element={<Game />} />
          <Route
            path="/gameover"
            element={<GameOver scores={scores} addScore={addScore} />}
          />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}
