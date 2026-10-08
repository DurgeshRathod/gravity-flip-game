import { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { FaTrophy, FaDice, FaCalendarDay, FaGamepad, FaQuestionCircle } from 'react-icons/fa';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.5),
                0 0 40px rgba(255, 107, 107, 0.3);
  }
  50% { 
    box-shadow: 0 0 30px rgba(255, 107, 107, 0.7),
                0 0 60px rgba(255, 107, 107, 0.4);
  }
`;

const Container = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  padding: 40px;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 107, 107, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 50%, #6bcf7f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: -2px;
  animation: ${pulse} 3s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(255, 107, 107, 0.3));
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;
`;

const InputContainer = styled(motion.div)`
  margin-bottom: 30px;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 30px;
  font-size: 1.2rem;
  border: 2px solid rgba(255, 107, 107, 0.3);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  backdrop-filter: blur(10px);
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    outline: none;
    border-color: #ff6b6b;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const ButtonGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 600px;
  margin-bottom: 30px;
`;

const Button = styled(motion.button)`
  padding: 20px 30px;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 20px;
  background: ${props => props.$primary 
    ? 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    
    &::before {
      width: 300px;
      height: 300px;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  ${props => props.$primary && css`
    animation: ${glow} 2s ease-in-out infinite;
  `}
`;

const HighScore = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  color: #ffd93d;
  margin-top: 20px;
  padding: 15px 30px;
  background: rgba(255, 217, 61, 0.1);
  border-radius: 15px;
  border: 2px solid rgba(255, 217, 61, 0.3);
`;

const Instructions = styled(motion.div)`
  position: absolute;
  bottom: 30px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
`;

const HowToPlayButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const HowToPlayModal = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(15, 32, 39, 0.98);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  z-index: 100;
`;

const ModalContent = styled.div`
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  padding: 40px;
  border: 2px solid rgba(255, 107, 107, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const InstructionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const InstructionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  color: white;
  font-size: 1.1rem;
  line-height: 1.6;
  
  .icon {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    background: linear-gradient(135deg, ${props => props.$color || '#667eea'} 0%, ${props => props.$color || '#764ba2'} 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-top: 2px;
  }
  
  .text {
    flex: 1;
    
    strong {
      color: ${props => props.$color || '#ff6b6b'};
    }
  }
`;

const CloseButton = styled(motion.button)`
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 50px;
  background: linear-gradient(45deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s;
  margin: 0 auto;
  display: block;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.4);
  }
`;

function StartScreen({ onStart, highScore }) {
  const [playerName, setPlayerName] = useState('');
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleCustomLevel = () => {
    if (playerName.trim()) {
      onStart(playerName.trim(), 'custom');
    }
  };

  const handleRandomLevel = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    onStart(randomSeed, 'random');
  };

  const handleDailyChallenge = () => {
    const today = new Date().toISOString().split('T')[0];
    onStart(today, 'daily');
  };

  return (
    <>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <HowToPlayButton
          onClick={() => setShowHowToPlay(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaQuestionCircle />
          How to Play
        </HowToPlayButton>
        
        <Title
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        GRAVITY FLIP
      </Title>
      
      <Subtitle
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        One tap. Infinite possibilities.
      </Subtitle>
      
      <InputContainer
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
      >
        <Input
          type="text"
          placeholder="Enter name to generate level"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCustomLevel()}
          maxLength={20}
        />
      </InputContainer>
      
      <ButtonGrid
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          $primary
          onClick={handleCustomLevel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!playerName.trim()}
          style={{ opacity: playerName.trim() ? 1 : 0.6 }}
        >
          <FaGamepad />
          Play Your Level
        </Button>
        
        <Button
          onClick={handleRandomLevel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaDice />
          Random Level
        </Button>
        
        <Button
          onClick={handleDailyChallenge}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCalendarDay />
          Daily Challenge
        </Button>
      </ButtonGrid>
      
      {highScore > 0 && (
        <HighScore
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <FaTrophy />
          High Score: {highScore.toLocaleString()}
        </HighScore>
      )}
      
        <Instructions
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Press SPACE or TAP to flip gravity
        </Instructions>
      </Container>
      
      {showHowToPlay && (
        <HowToPlayModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ModalContent>
            <ModalTitle>How to Play</ModalTitle>
            <InstructionsList>
              <InstructionItem $color="#ff6b6b">
                <div className="icon">1</div>
                <div className="text">
                  <strong>Control:</strong> Press SPACE or TAP the screen to flip gravity. Your character will fall up or down based on gravity direction.
                </div>
              </InstructionItem>
              
              <InstructionItem $color="#ffd93d">
                <div className="icon">2</div>
                <div className="text">
                  <strong>Avoid Obstacles:</strong> Navigate through barriers, gaps, and moving platforms. Purple blocks are static, yellow blocks move!
                </div>
              </InstructionItem>
              
              <InstructionItem $color="#6bcf7f">
                <div className="icon">3</div>
                <div className="text">
                  <strong>Collect Gems:</strong> Green hexagons give you points and build combos. Chain collections for massive scores!
                </div>
              </InstructionItem>
              
              <InstructionItem $color="#667eea">
                <div className="icon">4</div>
                <div className="text">
                  <strong>Unique Levels:</strong> Enter your name to generate a unique level. Share your level code with friends to challenge them!
                </div>
              </InstructionItem>
              
              <InstructionItem $color="#ff8e53">
                <div className="icon">5</div>
                <div className="text">
                  <strong>Go Viral:</strong> Share your high scores on social media. Each name creates a different level - find the easiest or hardest one!
                </div>
              </InstructionItem>
            </InstructionsList>
            
            <CloseButton
              onClick={() => setShowHowToPlay(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Got It!
            </CloseButton>
          </ModalContent>
        </HowToPlayModal>
      )}
    </>
  );
}

export default StartScreen;