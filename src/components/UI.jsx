import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const comboAnimation = keyframes`
  0% { transform: scale(0.5) rotate(-10deg); }
  50% { transform: scale(1.3) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const UIContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 100;
  pointer-events: none;
`;

const ScoreDisplay = styled(motion.div)`
  font-size: 3rem;
  font-weight: 900;
  color: white;
  text-shadow: 
    0 0 20px rgba(255, 107, 107, 0.5),
    0 5px 10px rgba(0, 0, 0, 0.3),
    0 10px 20px rgba(0, 0, 0, 0.2);
  letter-spacing: -2px;
  margin-bottom: 10px;
  
  span {
    background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ComboDisplay = styled(motion.div)`
  font-size: 2rem;
  font-weight: 700;
  color: #ffd93d;
  text-shadow: 
    0 0 30px rgba(255, 217, 61, 0.7),
    0 5px 10px rgba(0, 0, 0, 0.3);
  opacity: ${props => props.$visible ? 1 : 0};
  transform: ${props => props.$visible ? 'scale(1)' : 'scale(0.8)'};
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  ${props => props.$visible && css`
    animation: ${comboAnimation} 0.5s ease-out;
  `}
`;

const HighScoreDisplay = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 10px;
  font-weight: 600;
`;

const PowerUpIndicator = styled(motion.div)`
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  gap: 10px;
`;

const PowerUp = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background: linear-gradient(135deg, ${props => props.$color} 0%, ${props => props.$color}dd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 5px 20px rgba(0, 0, 0, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  font-size: 1.5rem;
`;

function UI({ score, combo, highScore }) {
  return (
    <>
      <UIContainer>
        <ScoreDisplay
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <span>{score.toLocaleString()}</span>
        </ScoreDisplay>
        
        <AnimatePresence>
          {combo > 0 && (
            <ComboDisplay
              $visible={combo > 0}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              COMBO x{combo}
            </ComboDisplay>
          )}
        </AnimatePresence>
        
        {highScore > 0 && (
          <HighScoreDisplay>
            Best: {highScore.toLocaleString()}
          </HighScoreDisplay>
        )}
      </UIContainer>
    </>
  );
}

export default UI;