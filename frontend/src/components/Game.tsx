import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { useGameState } from '../hooks/useGameState';
import GameUI from './GameUI';
import BoyCharacter from './BoyCharacter';

const BG_IMG_SRC = '/assets/generated/urban-background.dim_1600x600.png';

// Classic Flappy Bird pipe colors
const PIPE_GREEN = '#4EC853';
const PIPE_GREEN_DARK = '#2E8B2E';
const PIPE_GREEN_LIGHT = '#6FD96F';
const PIPE_CAP_EXTRA = 10; // extra width on each side for the cap/lip

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number>(0);

  const {
    stateRef,
    gameStatus,
    score,
    highScore,
    isEasterEggActive,
    isScore5EasterEggActive,
    isScore10EasterEggActive,
    isScore17EasterEggActive,
    flap,
    restart,
    tick,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PLAYER_X,
    PLAYER_SIZE,
    OBSTACLE_WIDTH,
  } = useGameState();

  // Preload background image
  useEffect(() => {
    const bg = new Image();
    bg.src = BG_IMG_SRC;
    bgImgRef.current = bg;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = stateRef.current;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw scrolling background
    const bgImg = bgImgRef.current;
    if (bgImg && bgImg.complete) {
      const bgW = CANVAS_WIDTH;
      const bgH = CANVAS_HEIGHT;
      const offset = s.bgOffset % bgW;
      ctx.drawImage(bgImg, -offset, 0, bgW, bgH);
      ctx.drawImage(bgImg, bgW - offset, 0, bgW, bgH);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      grad.addColorStop(0, '#87CEEB');
      grad.addColorStop(1, '#228B22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Draw classic green pipes
    for (const obs of s.obstacles) {
      const obsLeft = obs.x - OBSTACLE_WIDTH / 2;
      const topHeight = obs.gapY;
      const bottomY = obs.gapY + obs.gapSize;
      const bottomHeight = CANVAS_HEIGHT - bottomY - 20;
      const capH = 22;
      const capExtra = PIPE_CAP_EXTRA;

      // ---- TOP PIPE ----
      if (topHeight > 0) {
        // Main pipe body
        ctx.fillStyle = PIPE_GREEN;
        ctx.fillRect(obsLeft, 0, OBSTACLE_WIDTH, topHeight - capH);

        // Pipe body highlight (left edge)
        ctx.fillStyle = PIPE_GREEN_LIGHT;
        ctx.fillRect(obsLeft + 3, 0, 6, topHeight - capH);

        // Pipe body shadow (right edge)
        ctx.fillStyle = PIPE_GREEN_DARK;
        ctx.fillRect(obsLeft + OBSTACLE_WIDTH - 6, 0, 6, topHeight - capH);

        // Cap / lip at the bottom of top pipe
        ctx.fillStyle = PIPE_GREEN;
        ctx.fillRect(obsLeft - capExtra, topHeight - capH, OBSTACLE_WIDTH + capExtra * 2, capH);

        // Cap highlight
        ctx.fillStyle = PIPE_GREEN_LIGHT;
        ctx.fillRect(obsLeft - capExtra + 3, topHeight - capH, 8, capH);

        // Cap shadow
        ctx.fillStyle = PIPE_GREEN_DARK;
        ctx.fillRect(obsLeft + OBSTACLE_WIDTH + capExtra - 8, topHeight - capH, 8, capH);

        // Cap bottom border
        ctx.fillStyle = PIPE_GREEN_DARK;
        ctx.fillRect(obsLeft - capExtra, topHeight - 3, OBSTACLE_WIDTH + capExtra * 2, 3);

        // Pipe outline
        ctx.strokeStyle = PIPE_GREEN_DARK;
        ctx.lineWidth = 2;
        ctx.strokeRect(obsLeft, 0, OBSTACLE_WIDTH, topHeight - capH);
        ctx.strokeRect(obsLeft - capExtra, topHeight - capH, OBSTACLE_WIDTH + capExtra * 2, capH);

        // Comment text on top pipe body
        if (topHeight > 60) {
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold 9px Nunito, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 3;
          const maxW = OBSTACLE_WIDTH - 10;
          const words = obs.topComment.split(' ');
          let line = '';
          const lines: string[] = [];
          for (const word of words) {
            const test = line ? `${line} ${word}` : word;
            if (ctx.measureText(test).width > maxW && line) {
              lines.push(line);
              line = word;
            } else {
              line = test;
            }
          }
          if (line) lines.push(line);
          const lineH = 11;
          const textAreaH = topHeight - capH;
          const startY = textAreaH / 2 - ((lines.length - 1) * lineH) / 2;
          lines.forEach((l, i) => ctx.fillText(l, obs.x, startY + i * lineH));
          ctx.restore();
        }
      }

      // ---- BOTTOM PIPE ----
      if (bottomHeight > 0) {
        // Cap / lip at the top of bottom pipe
        ctx.fillStyle = PIPE_GREEN;
        ctx.fillRect(obsLeft - capExtra, bottomY, OBSTACLE_WIDTH + capExtra * 2, capH);

        // Cap highlight
        ctx.fillStyle = PIPE_GREEN_LIGHT;
        ctx.fillRect(obsLeft - capExtra + 3, bottomY, 8, capH);

        // Cap shadow
        ctx.fillStyle = PIPE_GREEN_DARK;
        ctx.fillRect(obsLeft + OBSTACLE_WIDTH + capExtra - 8, bottomY, 8, capH);

        // Cap top border
        ctx.fillStyle = PIPE_GREEN_DARK;
        ctx.fillRect(obsLeft - capExtra, bottomY, OBSTACLE_WIDTH + capExtra * 2, 3);

        // Main pipe body
        ctx.fillStyle = PIPE_GREEN;
        ctx.fillRect(obsLeft, bottomY + capH, OBSTACLE_WIDTH, bottomHeight - capH);

        // Pipe body highlight
        ctx.fillStyle = PIPE_GREEN_LIGHT;
        ctx.fillRect(obsLeft + 3, bottomY + capH, 6, bottomHeight - capH);

        // Pipe body shadow
        ctx.fillStyle = PIPE_GREEN_DARK;
        ctx.fillRect(obsLeft + OBSTACLE_WIDTH - 6, bottomY + capH, 6, bottomHeight - capH);

        // Pipe outline
        ctx.strokeStyle = PIPE_GREEN_DARK;
        ctx.lineWidth = 2;
        ctx.strokeRect(obsLeft - capExtra, bottomY, OBSTACLE_WIDTH + capExtra * 2, capH);
        ctx.strokeRect(obsLeft, bottomY + capH, OBSTACLE_WIDTH, bottomHeight - capH);

        // Comment text on bottom pipe body
        if (bottomHeight > 60) {
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold 9px Nunito, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 3;
          const maxW = OBSTACLE_WIDTH - 10;
          const words = obs.bottomComment.split(' ');
          let line = '';
          const lines: string[] = [];
          for (const word of words) {
            const test = line ? `${line} ${word}` : word;
            if (ctx.measureText(test).width > maxW && line) {
              lines.push(line);
              line = word;
            } else {
              line = test;
            }
          }
          if (line) lines.push(line);
          const lineH = 11;
          const textAreaMidY = bottomY + capH + (bottomHeight - capH) / 2;
          const startY = textAreaMidY - ((lines.length - 1) * lineH) / 2;
          lines.forEach((l, i) => ctx.fillText(l, obs.x, startY + i * lineH));
          ctx.restore();
        }
      }
    }

    // Draw ground
    ctx.fillStyle = '#3d7a1f';
    ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);
    ctx.fillStyle = '#5aaa2e';
    ctx.fillRect(0, CANVAS_HEIGHT - 22, CANVAS_WIDTH, 3);
  }, [stateRef, CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_X, PLAYER_SIZE, OBSTACLE_WIDTH]);

  // Game loop
  useEffect(() => {
    const loop = () => {
      tick();
      draw();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [tick, draw]);

  // Input handling
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [flap]);

  // Compute 3D boy position in normalized Three.js coords
  // Canvas is CANVAS_WIDTH x CANVAS_HEIGHT pixels
  // We'll use an orthographic camera matching canvas dimensions
  const s = stateRef.current;
  const playerY = s.playerY;
  const playerVelocity = s.playerVelocity;
  const tilt = Math.max(-0.5, Math.min(0.5, playerVelocity * 0.04));
  const isFlapping = playerVelocity < -2;

  // Convert canvas pixel coords to Three.js world coords
  // Orthographic camera: left=-CANVAS_WIDTH/2, right=CANVAS_WIDTH/2, top=CANVAS_HEIGHT/2, bottom=-CANVAS_HEIGHT/2
  const boyWorldX = PLAYER_X - CANVAS_WIDTH / 2;
  const boyWorldY = -(playerY - CANVAS_HEIGHT / 2);

  return (
    <div
      className="relative flex items-center justify-center w-full h-full"
      style={{ background: '#0a0414' }}
    >
      <div className="relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
        {/* 2D background + pipes canvas */}
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block absolute inset-0"
          style={{ imageRendering: 'pixelated', zIndex: 1 }}
          onClick={flap}
          tabIndex={0}
        />

        {/* 3D boy character overlay using React Three Fiber */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 2 }}
        >
          <Canvas
            style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
            gl={{ alpha: true, antialias: true }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
            }}
          >
            <OrthographicCamera
              makeDefault
              left={-CANVAS_WIDTH / 2}
              right={CANVAS_WIDTH / 2}
              top={CANVAS_HEIGHT / 2}
              bottom={-CANVAS_HEIGHT / 2}
              near={0.1}
              far={1000}
              position={[0, 0, 100]}
            />
            <ambientLight intensity={0.7} />
            <directionalLight position={[50, 100, 80]} intensity={1.2} />
            <directionalLight position={[-30, -50, 30]} intensity={0.3} color="#ffaa44" />

            {/* Scale the boy to match PLAYER_SIZE pixels */}
            <group
              position={[boyWorldX, boyWorldY, 0]}
              scale={[PLAYER_SIZE * 1.1, PLAYER_SIZE * 1.1, PLAYER_SIZE * 1.1]}
            >
              <BoyCharacter isFlapping={isFlapping} tilt={tilt} />
            </group>
          </Canvas>
        </div>

        {/* UI overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
          <GameUI
            gameStatus={gameStatus}
            score={score}
            highScore={highScore}
            onStart={flap}
            onRestart={restart}
            canvasWidth={CANVAS_WIDTH}
            canvasHeight={CANVAS_HEIGHT}
            isEasterEggActive={isEasterEggActive}
            isScore5EasterEggActive={isScore5EasterEggActive}
            isScore10EasterEggActive={isScore10EasterEggActive}
            isScore17EasterEggActive={isScore17EasterEggActive}
          />
        </div>
      </div>
    </div>
  );
}
