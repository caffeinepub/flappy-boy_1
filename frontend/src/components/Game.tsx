import React, { useRef, useEffect, useCallback } from 'react';
import { useGameState } from '../hooks/useGameState';
import GameUI from './GameUI';

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;
const PLAYER_X = 100;
const PLAYER_SIZE = 48;
const OBSTACLE_WIDTH = 90;

// Pipe colors — warm street-art palette
const PIPE_BODY_FILL = '#cc2200';
const PIPE_BODY_FILL2 = '#991a00';
const PIPE_CAP_FILL = '#ff4400';
const PIPE_CAP_FILL2 = '#cc2200';
const PIPE_STROKE = '#660e00';
const PIPE_TEXT_COLOR = '#fff5e0';
const PIPE_TEXT_SHADOW = '#660e00';
const PIPE_HIGHLIGHT = 'rgba(255,180,100,0.25)';

// Boy character colors
const SKIN_COLOR = '#5c3317';
const SHIRT_COLOR = '#ff6b00';
const PANTS_COLOR = '#1a3a6b';
const SHOE_COLOR = '#1a1a1a';
const HAIR_COLOR = '#1a0a00';
const EYE_WHITE = '#ffffff';
const EYE_PUPIL = '#1a0a00';

// Preload the classroom background image
const bgImage = new Image();
bgImage.src = '/assets/generated/background.dim_1280x720.png';

function drawBackground(ctx: CanvasRenderingContext2D, bgOffset: number) {
  if (bgImage.complete && bgImage.naturalWidth > 0) {
    const imgW = bgImage.naturalWidth;
    const imgH = bgImage.naturalHeight;
    const scale = CANVAS_HEIGHT / imgH;
    const drawW = imgW * scale;

    const scrollX = bgOffset % drawW;

    ctx.drawImage(bgImage, -scrollX, 0, drawW, CANVAS_HEIGHT);
    ctx.drawImage(bgImage, drawW - scrollX, 0, drawW, CANVAS_HEIGHT);

    if (drawW - scrollX < CANVAS_WIDTH) {
      ctx.drawImage(bgImage, drawW * 2 - scrollX, 0, drawW, CANVAS_HEIGHT);
    }
  } else {
    ctx.fillStyle = '#c8e0f0';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  // Ground strip at bottom
  ctx.fillStyle = 'rgba(30, 20, 5, 0.55)';
  ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);
  ctx.strokeStyle = '#ff8c00';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_HEIGHT - 20);
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 20);
  ctx.stroke();
}

function drawBoy(ctx: CanvasRenderingContext2D, x: number, y: number, velocity: number, frame: number) {
  ctx.save();
  ctx.translate(x, y);

  const tilt = Math.max(-0.4, Math.min(0.5, velocity * 0.04));
  ctx.rotate(tilt);

  const s = PLAYER_SIZE;
  const hs = s / 2;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, hs - 2, hs * 0.7, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs (animated)
  const legSwing = Math.sin(frame * 0.3) * 0.3;
  ctx.strokeStyle = PANTS_COLOR;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';

  // Left leg
  ctx.save();
  ctx.rotate(legSwing);
  ctx.beginPath();
  ctx.moveTo(-4, hs * 0.3);
  ctx.lineTo(-6, hs * 0.85);
  ctx.stroke();
  ctx.fillStyle = SHOE_COLOR;
  ctx.beginPath();
  ctx.ellipse(-8, hs * 0.88, 7, 4, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right leg
  ctx.save();
  ctx.rotate(-legSwing);
  ctx.beginPath();
  ctx.moveTo(4, hs * 0.3);
  ctx.lineTo(6, hs * 0.85);
  ctx.stroke();
  ctx.fillStyle = SHOE_COLOR;
  ctx.beginPath();
  ctx.ellipse(8, hs * 0.88, 7, 4, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Body / shirt
  ctx.fillStyle = SHIRT_COLOR;
  ctx.beginPath();
  ctx.roundRect(-hs * 0.55, -hs * 0.1, hs * 1.1, hs * 0.55, 6);
  ctx.fill();

  // Shirt stripe
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(-hs * 0.55, hs * 0.05, hs * 1.1, 5);

  // Arms (animated)
  const armSwing = Math.sin(frame * 0.3 + Math.PI) * 0.4;
  ctx.strokeStyle = SKIN_COLOR;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';

  // Left arm
  ctx.save();
  ctx.rotate(armSwing);
  ctx.beginPath();
  ctx.moveTo(-hs * 0.55, -hs * 0.05);
  ctx.lineTo(-hs * 0.85, hs * 0.25);
  ctx.stroke();
  ctx.restore();

  // Right arm
  ctx.save();
  ctx.rotate(-armSwing);
  ctx.beginPath();
  ctx.moveTo(hs * 0.55, -hs * 0.05);
  ctx.lineTo(hs * 0.85, hs * 0.25);
  ctx.stroke();
  ctx.restore();

  // Head
  ctx.fillStyle = SKIN_COLOR;
  ctx.beginPath();
  ctx.arc(0, -hs * 0.45, hs * 0.42, 0, Math.PI * 2);
  ctx.fill();

  // Hair (afro style)
  ctx.fillStyle = HAIR_COLOR;
  ctx.beginPath();
  ctx.arc(0, -hs * 0.6, hs * 0.38, Math.PI, 0);
  ctx.fill();
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(i * 5, -hs * 0.72, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Eyes
  ctx.fillStyle = EYE_WHITE;
  ctx.beginPath();
  ctx.ellipse(-7, -hs * 0.45, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(7, -hs * 0.45, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = EYE_PUPIL;
  ctx.beginPath();
  ctx.arc(-6, -hs * 0.45, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(8, -hs * 0.45, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Eye shine
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(-5, -hs * 0.47, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(9, -hs * 0.47, 1, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#3a1a00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -hs * 0.38, 6, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Nose
  ctx.fillStyle = '#4a2a10';
  ctx.beginPath();
  ctx.arc(1, -hs * 0.42, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draw a single pipe column (top or bottom).
 * For top pipe: extends from y=0 down to y=pipeBottom.
 * For bottom pipe: extends from y=pipeTop down to y=CANVAS_HEIGHT-20.
 */
function drawPipe(
  ctx: CanvasRenderingContext2D,
  pipeX: number,
  pipeWidth: number,
  pipeTop: number,
  pipeBottom: number,
  isTopPipe: boolean,
  comment: string
) {
  const capHeight = 18;
  const capOverhang = 8; // how much wider the cap is on each side
  const capWidth = pipeWidth + capOverhang * 2;
  const bodyHeight = pipeBottom - pipeTop;

  if (bodyHeight <= 0) return;

  ctx.save();

  // --- Pipe body gradient ---
  const grad = ctx.createLinearGradient(pipeX - pipeWidth / 2, 0, pipeX + pipeWidth / 2, 0);
  grad.addColorStop(0, PIPE_BODY_FILL2);
  grad.addColorStop(0.3, PIPE_BODY_FILL);
  grad.addColorStop(0.6, PIPE_BODY_FILL);
  grad.addColorStop(1, PIPE_BODY_FILL2);

  // Draw body
  ctx.fillStyle = grad;
  ctx.strokeStyle = PIPE_STROKE;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.rect(pipeX - pipeWidth / 2, pipeTop, pipeWidth, bodyHeight);
  ctx.fill();
  ctx.stroke();

  // Highlight stripe on body
  ctx.fillStyle = PIPE_HIGHLIGHT;
  ctx.fillRect(pipeX - pipeWidth / 2 + 6, pipeTop, 10, bodyHeight);

  // --- Pipe cap (at the gap-facing end) ---
  const capGrad = ctx.createLinearGradient(
    pipeX - capWidth / 2, 0,
    pipeX + capWidth / 2, 0
  );
  capGrad.addColorStop(0, PIPE_CAP_FILL2);
  capGrad.addColorStop(0.3, PIPE_CAP_FILL);
  capGrad.addColorStop(0.6, PIPE_CAP_FILL);
  capGrad.addColorStop(1, PIPE_CAP_FILL2);

  let capY: number;
  if (isTopPipe) {
    capY = pipeBottom - capHeight;
  } else {
    capY = pipeTop;
  }

  ctx.fillStyle = capGrad;
  ctx.strokeStyle = PIPE_STROKE;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(
    pipeX - capWidth / 2,
    capY,
    capWidth,
    capHeight,
    isTopPipe ? [0, 0, 6, 6] : [6, 6, 0, 0]
  );
  ctx.fill();
  ctx.stroke();

  // Cap highlight
  ctx.fillStyle = PIPE_HIGHLIGHT;
  ctx.beginPath();
  ctx.roundRect(
    pipeX - capWidth / 2 + 6,
    capY + 3,
    10,
    capHeight - 6,
    3
  );
  ctx.fill();

  // --- Comment text on pipe body ---
  // Only draw text if body is tall enough
  const textAreaTop = pipeTop;
  const textAreaBottom = isTopPipe ? pipeBottom - capHeight : pipeBottom;
  const textAreaHeight = textAreaBottom - textAreaTop;

  if (textAreaHeight > 30) {
    ctx.save();
    // Clip to pipe body so text doesn't overflow
    ctx.beginPath();
    ctx.rect(pipeX - pipeWidth / 2, textAreaTop, pipeWidth, textAreaHeight);
    ctx.clip();

    ctx.fillStyle = PIPE_TEXT_COLOR;
    ctx.font = 'bold 10px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Word-wrap
    const words = comment.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxTextWidth = pipeWidth - 10;

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxTextWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    const lineHeight = 13;
    const totalTextH = lines.length * lineHeight;
    // Center text vertically in the text area
    const startY = textAreaTop + (textAreaHeight - totalTextH) / 2;

    lines.forEach((line, i) => {
      // Text shadow
      ctx.fillStyle = PIPE_TEXT_SHADOW;
      ctx.fillText(line, pipeX + 1, startY + i * lineHeight + 1);
      ctx.fillStyle = PIPE_TEXT_COLOR;
      ctx.fillText(line, pipeX, startY + i * lineHeight);
    });

    ctx.restore();
  }

  ctx.restore();
}

function drawObstacles(
  ctx: CanvasRenderingContext2D,
  obstacles: ReturnType<typeof useGameState>['stateRef']['current']['obstacles'],
  obstacleWidth: number
) {
  obstacles.forEach(obs => {
    const topPipeBottom = obs.gapY;
    const bottomPipeTop = obs.gapY + obs.gapSize;
    const groundY = CANVAS_HEIGHT - 20;

    // Top pipe: from canvas top (0) down to gapY
    if (topPipeBottom > 0) {
      drawPipe(ctx, obs.x, obstacleWidth, 0, topPipeBottom, true, obs.topComment);
    }

    // Bottom pipe: from gapY+gapSize down to ground
    if (bottomPipeTop < groundY) {
      drawPipe(ctx, obs.x, obstacleWidth, bottomPipeTop, groundY, false, obs.bottomComment);
    }
  });
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const frameRef = useRef(0);

  const {
    stateRef,
    gameStatus,
    score,
    highScore,
    isEasterEggActive,
    isScore5EasterEggActive,
    isScore10EasterEggActive,
    flap,
    restart,
    tick,
  } = useGameState();

  const handleInput = useCallback(() => {
    flap();
  }, [flap]);

  const handleRestart = useCallback(() => {
    restart();
  }, [restart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleInput();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleInput]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      frameRef.current++;
      const s = stateRef.current;

      tick();

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawBackground(ctx, s.bgOffset);
      drawObstacles(ctx, s.obstacles, OBSTACLE_WIDTH);
      drawBoy(ctx, PLAYER_X, s.playerY, s.playerVelocity, frameRef.current);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [tick, stateRef]);

  return (
    <div className="relative flex items-center justify-center w-full h-screen bg-black overflow-hidden">
      <div className="relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block cursor-pointer"
          onClick={handleInput}
          style={{ imageRendering: 'pixelated' }}
        />
        <GameUI
          gameStatus={gameStatus}
          score={score}
          highScore={highScore}
          onStart={handleInput}
          onRestart={handleRestart}
          canvasWidth={CANVAS_WIDTH}
          canvasHeight={CANVAS_HEIGHT}
          isEasterEggActive={isEasterEggActive}
          isScore5EasterEggActive={isScore5EasterEggActive}
          isScore10EasterEggActive={isScore10EasterEggActive}
        />
      </div>
    </div>
  );
}
