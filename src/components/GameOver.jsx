import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FaTwitter, FaShareAlt, FaRedo, FaHome, FaCopy } from 'react-icons/fa';
import { useState } from 'react';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const Container = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, rgba(15, 32, 39, 0.95) 0%, rgba(32, 58, 67, 0.95) 100%);
  backdrop-filter: blur(20px);
  padding: 40px;
`;

const Title = styled(motion.h2)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: -1px;
`;

const ScoreContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const FinalScore = styled(motion.div)`
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  background: linear-gradient(135deg, #ffd93d 0%, #ff6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  animation: ${float} 3s ease-in-out infinite;
`;

const ScoreLabel = styled.div`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;
`;

const NewRecord = styled(motion.div)`
  padding: 10px 20px;
  background: linear-gradient(135deg, #6bcf7f 0%, #4ade80 100%);
  border-radius: 30px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(107, 207, 127, 0.3);
`;

const ShareContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const LevelCode = styled(motion.div)`
  font-family: 'Courier New', monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 30px;
  border-radius: 15px;
  border: 2px solid rgba(255, 107, 107, 0.3);
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 107, 107, 0.5);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CopyNotification = styled(motion.div)`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #6bcf7f;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const ShareButton = styled(motion.button)`
  padding: 15px 25px;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 15px;
  background: ${props => props.$twitter 
    ? 'linear-gradient(135deg, #1DA1F2 0%, #0d8bd9 100%)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
`;

const ActionButton = styled(motion.button)`
  padding: 18px 35px;
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
`;

function GameOver({ score, highScore, levelSeed, onRestart, onNewLevel }) {
  const [copied, setCopied] = useState(false);
  const isNewRecord = score > highScore;

  const shareTwitter = () => {
    const text = `I scored ${score.toLocaleString()} in Gravity Flip${levelSeed ? ` on level "${levelSeed}"` : ''}! Can you beat my score? 🎮`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=GravityFlip,Gaming`;
    window.open(url, '_blank');
  };

  const copyLevelCode = () => {
    const shareUrl = `${window.location.origin}?level=${encodeURIComponent(levelSeed)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareGeneral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Gravity Flip',
        text: `I scored ${score.toLocaleString()} in Gravity Flip! Can you beat my score?`,
        url: window.location.href
      });
    } else {
      copyLevelCode();
    }
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        GAME OVER
      </Title>
      
      <ScoreContainer>
        <ScoreLabel>Final Score</ScoreLabel>
        <FinalScore
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          {score.toLocaleString()}
        </FinalScore>
        
        {isNewRecord && (
          <NewRecord
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            🏆 New Record!
          </NewRecord>
        )}
      </ScoreContainer>
      
      <ShareContainer
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {levelSeed && (
          <LevelCode onClick={copyLevelCode}>
            Level: {levelSeed}
            <FaCopy style={{ marginLeft: '10px', fontSize: '0.9rem' }} />
            {copied && (
              <CopyNotification
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                Copied to clipboard!
              </CopyNotification>
            )}
          </LevelCode>
        )}
        
        <ShareButtons>
          <ShareButton
            $twitter
            onClick={shareTwitter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTwitter />
            Share Score
          </ShareButton>
          
          <ShareButton
            onClick={shareGeneral}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaShareAlt />
            Share Level
          </ShareButton>
        </ShareButtons>
      </ShareContainer>
      
      <ActionButtons>
        <ActionButton
          $primary
          onClick={onRestart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <FaRedo />
          Play Again
        </ActionButton>
        
        <ActionButton
          onClick={onNewLevel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <FaHome />
          New Level
        </ActionButton>
      </ActionButtons>
    </Container>
  );
}

export default GameOver;