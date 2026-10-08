import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
`;

const Game = forwardRef(({ levelSeed, gameMode, onGameOver, onScoreUpdate, onComboUpdate, ghostData }, ref) => {
  const canvasRef = useRef(null);
  const gameStateRef = useRef(null);
  const animationRef = useRef(null);

  useImperativeHandle(ref, () => ({
    restart: () => initGame(),
    pause: () => gameStateRef.current.paused = true,
    resume: () => gameStateRef.current.paused = false
  }));

  class Particle {
    constructor(x, y, color, velocity) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.velocity = velocity;
      this.life = 1.0;
      this.decay = 0.02;
      this.size = Math.random() * 3 + 1;
    }

    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.life -= this.decay;
      this.velocity.x *= 0.98;
      this.velocity.y *= 0.98;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 30;
      this.height = 30;
      this.velocity = { x: 4, y: 0 };
      this.gravity = 0.5;
      this.gravityDirection = 1;
      this.trail = [];
      this.maxTrailLength = 10;
      this.color = '#ff6b6b';
      this.glowIntensity = 0;
    }

    update(canvas) {
      this.velocity.y += this.gravity * this.gravityDirection;
      this.velocity.y = Math.max(-15, Math.min(15, this.velocity.y));
      
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }

      if (this.y < 0 || this.y + this.height > canvas.height) {
        return false;
      }

      this.glowIntensity = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;
      return true;
    }

    flip() {
      this.gravityDirection *= -1;
      this.velocity.y = -8 * this.gravityDirection;
      
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 / 10) * i;
        gameStateRef.current.particles.push(
          new Particle(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.color,
            {
              x: Math.cos(angle) * 3,
              y: Math.sin(angle) * 3
            }
          )
        );
      }
    }

    draw(ctx) {
      this.trail.forEach((point, index) => {
        ctx.save();
        ctx.globalAlpha = index / this.trail.length * 0.5;
        ctx.fillStyle = this.color;
        ctx.fillRect(point.x, point.y, this.width, this.height);
        ctx.restore();
      });

      ctx.save();
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 20 + this.glowIntensity * 10;
      ctx.shadowColor = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
      
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x + 8, this.y + 8, this.width - 16, this.height - 16);
      ctx.restore();
    }
  }

  class Obstacle {
    constructor(x, y, width, height, type = 'normal') {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.type = type;
      this.color = type === 'moving' ? '#ffd93d' : '#764ba2';
      this.moveSpeed = type === 'moving' ? 2 : 0;
      this.moveDirection = 1;
      this.originalY = y;
    }

    update() {
      if (this.type === 'moving') {
        this.y += this.moveSpeed * this.moveDirection;
        if (Math.abs(this.y - this.originalY) > 100) {
          this.moveDirection *= -1;
        }
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
      
      const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, this.type === 'moving' ? '#ff8e53' : '#667eea');
      ctx.fillStyle = gradient;
      
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.restore();
    }
  }

  class Collectible {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 15;
      this.collected = false;
      this.rotation = 0;
      this.floatOffset = Math.random() * Math.PI * 2;
    }

    update() {
      this.rotation += 0.05;
      this.y += Math.sin(Date.now() * 0.003 + this.floatOffset) * 0.3;
    }

    draw(ctx) {
      if (this.collected) return;
      
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      gradient.addColorStop(0, '#6bcf7f');
      gradient.addColorStop(1, '#4ade80');
      
      ctx.fillStyle = gradient;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#6bcf7f';
      
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = Math.cos(angle) * this.size;
        const y = Math.sin(angle) * this.size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
  }

  function seedRandom(seed) {
    let value = 0;
    for (let i = 0; i < seed.length; i++) {
      value = ((value << 5) - value) + seed.charCodeAt(i);
      value = value & value;
    }
    return function() {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }

  function generateLevel(seed, canvas) {
    const random = seedRandom(seed);
    const obstacles = [];
    const collectibles = [];
    
    const levelLength = 100;
    const spacing = 250;
    
    for (let i = 1; i < levelLength; i++) {
      const x = i * spacing + 400;
      
      if (random() > 0.2) {
        const height = 80 + random() * 120;
        const y = random() > 0.5 ? 0 : canvas.height - height;
        const type = random() > 0.8 ? 'moving' : 'normal';
        obstacles.push(new Obstacle(x, y, 40 + random() * 40, height, type));
      }
      
      if (random() > 0.4 && i > 2) {
        const gapHeight = 120 + random() * 80;
        const gapY = 50 + random() * (canvas.height - gapHeight - 100);
        obstacles.push(new Obstacle(x + 120, 0, 40, gapY, 'normal'));
        obstacles.push(new Obstacle(x + 120, gapY + gapHeight, 40, canvas.height - gapY - gapHeight, 'normal'));
      }
      
      if (random() > 0.6) {
        const floatingHeight = 60 + random() * 40;
        const floatingY = canvas.height / 2 - floatingHeight / 2 + (random() - 0.5) * 200;
        obstacles.push(new Obstacle(x + 60, floatingY, 30, floatingHeight, random() > 0.5 ? 'moving' : 'normal'));
      }
      
      if (random() > 0.3) {
        collectibles.push(new Collectible(x - 50, 100 + random() * (canvas.height - 200)));
      }
    }
    
    return { obstacles, collectibles };
  }

  function checkCollision(player, obstacle) {
    return player.x < obstacle.x + obstacle.width &&
           player.x + player.width > obstacle.x &&
           player.y < obstacle.y + obstacle.height &&
           player.y + player.height > obstacle.y;
  }

  function checkCollectibleCollision(player, collectible) {
    if (collectible.collected) return false;
    
    const dx = (player.x + player.width / 2) - collectible.x;
    const dy = (player.y + player.height / 2) - collectible.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < collectible.size + player.width / 2;
  }

  function initGame() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const { obstacles, collectibles } = generateLevel(levelSeed, canvas);
    
    gameStateRef.current = {
      player: new Player(100, canvas.height / 2),
      obstacles,
      collectibles,
      particles: [],
      score: 0,
      combo: 0,
      comboTimer: 0,
      distance: 0,
      cameraX: 0,
      gameOver: false,
      paused: false
    };
  }

  function gameLoop() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;
    
    if (!state || state.gameOver || state.paused) {
      if (state?.gameOver) {
        onGameOver(state.score);
      }
      return;
    }
    
    ctx.fillStyle = 'rgba(15, 32, 39, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(30, 60, 114, 0.05)');
    gradient.addColorStop(1, 'rgba(42, 82, 152, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    state.cameraX += 4;
    state.distance++;
    
    if (!state.player.update(canvas)) {
      state.gameOver = true;
      return;
    }
    
    ctx.save();
    ctx.translate(-state.cameraX + 100, 0);
    
    state.obstacles.forEach(obstacle => {
      obstacle.update();
      const adjustedPlayer = {
        ...state.player,
        x: state.player.x + state.cameraX - 100
      };
      if (checkCollision(adjustedPlayer, obstacle)) {
        state.gameOver = true;
      }
      obstacle.draw(ctx);
    });
    
    state.collectibles.forEach(collectible => {
      collectible.update();
      const adjustedPlayer = {
        ...state.player,
        x: state.player.x + state.cameraX - 100
      };
      if (checkCollectibleCollision(adjustedPlayer, collectible)) {
        collectible.collected = true;
        state.score += 100 * (state.combo + 1);
        state.combo++;
        state.comboTimer = 120;
        onScoreUpdate(state.score);
        onComboUpdate(state.combo);
        
        for (let i = 0; i < 20; i++) {
          const angle = (Math.PI * 2 / 20) * i;
          state.particles.push(
            new Particle(
              collectible.x,
              collectible.y,
              '#6bcf7f',
              {
                x: Math.cos(angle) * 5,
                y: Math.sin(angle) * 5
              }
            )
          );
        }
      }
      collectible.draw(ctx);
    });
    
    state.player.draw(ctx);
    
    state.particles = state.particles.filter(particle => {
      particle.update();
      particle.draw(ctx);
      return particle.life > 0;
    });
    
    ctx.restore();
    
    if (state.comboTimer > 0) {
      state.comboTimer--;
      if (state.comboTimer === 0) {
        state.combo = 0;
        onComboUpdate(0);
      }
    }
    
    state.score += Math.floor(state.distance / 10);
    onScoreUpdate(state.score);
    
    animationRef.current = requestAnimationFrame(gameLoop);
  }

  useEffect(() => {
    initGame();
    
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && gameStateRef.current && !gameStateRef.current.gameOver) {
        e.preventDefault();
        gameStateRef.current.player.flip();
      }
    };
    
    const handleClick = () => {
      if (gameStateRef.current && !gameStateRef.current.gameOver) {
        gameStateRef.current.player.flip();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    canvasRef.current?.addEventListener('click', handleClick);
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      canvasRef.current?.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [levelSeed]);

  return <Canvas ref={canvasRef} />;
});

Game.displayName = 'Game';

export default Game;