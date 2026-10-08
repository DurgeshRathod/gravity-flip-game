import { useState, useEffect, useRef, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import GameOver from './components/GameOver';
import UI from './components/UI';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
`;

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
`;

const GameContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 1200px;
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 
    0 50px 100px rgba(0, 0, 0, 0.3),
    0 20px 40px rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    aspect-ratio: 9/16;
    max-width: 100%;
    border-radius: 20px;
  }
`;

function App() {
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [levelSeed, setLevelSeed] = useState('');
  const [gameMode, setGameMode] = useState('custom');
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('gravityFlipHighScore') || '0');
  });
  const [ghostData] = useState(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('gravityFlipHighScore', score);
    }
  }, [score, highScore]);

  const startGame = (seed, mode) => {
    setLevelSeed(seed);
    setGameMode(mode);
    setScore(0);
    setCombo(0);
    setGameState('playing');
  };

  const endGame = useCallback((finalScore) => {
    setScore(finalScore);
    setGameState('gameOver');
  }, []);

  const restart = () => {
    setScore(0);
    setCombo(0);
    setGameState('playing');
  };

  const newLevel = () => {
    setGameState('start');
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <GameContainer
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <AnimatePresence mode="wait">
            {gameState === 'start' && (
              <StartScreen 
                key="start"
                onStart={startGame}
                highScore={highScore}
              />
            )}
            
            {gameState === 'playing' && (
              <>
                <Game
                  key="game"
                  ref={gameRef}
                  levelSeed={levelSeed}
                  gameMode={gameMode}
                  onGameOver={endGame}
                  onScoreUpdate={setScore}
                  onComboUpdate={setCombo}
                  ghostData={ghostData}
                />
                <UI 
                  score={score} 
                  combo={combo}
                  highScore={highScore}
                />
              </>
            )}
            
            {gameState === 'gameOver' && (
              <GameOver
                key="gameOver"
                score={score}
                highScore={highScore}
                levelSeed={levelSeed}
                onRestart={restart}
                onNewLevel={newLevel}
              />
            )}
          </AnimatePresence>
        </GameContainer>
      </AppContainer>
    </>
  );
}

export default App
