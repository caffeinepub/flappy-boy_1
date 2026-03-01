import { useRef, useState, useCallback } from 'react';
import { getRandomComment } from '../data/negativeComments';

export type GameStatus = 'idle' | 'playing' | 'gameover';

export interface ObstacleData {
  id: number;
  x: number;
  gapY: number;
  gapSize: number;
  topComment: string;
  bottomComment: string;
  passed: boolean;
}

export interface GameState {
  status: GameStatus;
  score: number;
  highScore: number;
  playerY: number;
  playerVelocity: number;
  obstacles: ObstacleData[];
  bgOffset: number;
}

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;
const PLAYER_X = 100;
const GRAVITY = 0.5;
const FLAP_STRENGTH = -9;
const OBSTACLE_WIDTH = 90;
const OBSTACLE_SPEED_BASE = 2.5;
const OBSTACLE_INTERVAL = 220;
const GAP_SIZE = 220;
const PLAYER_SIZE = 48;

const EASTER_EGG_SCORE = 15;
const EASTER_EGG_SCORE_5 = 5;
const EASTER_EGG_SCORE_10 = 10;
const EASTER_EGG_SCORE_17 = 17;
const EASTER_EGG_DURATION_MS = 5000;
const EASTER_EGG_SPEED_FACTOR = 0.05;

export function useGameState() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);
  const [isScore5EasterEggActive, setIsScore5EasterEggActive] = useState(false);
  const [isScore10EasterEggActive, setIsScore10EasterEggActive] = useState(false);
  const [isScore17EasterEggActive, setIsScore17EasterEggActive] = useState(false);

  const stateRef = useRef<{
    status: GameStatus;
    playerY: number;
    playerVelocity: number;
    obstacles: ObstacleData[];
    bgOffset: number;
    score: number;
    nextObstacleId: number;
    framesSinceLastObstacle: number;
  }>({
    status: 'idle',
    playerY: CANVAS_HEIGHT / 2,
    playerVelocity: 0,
    obstacles: [],
    bgOffset: 0,
    score: 0,
    nextObstacleId: 0,
    framesSinceLastObstacle: 0,
  });

  // Easter egg tracking refs (not in stateRef to avoid stale closure issues)
  const easterEggTriggeredRef = useRef(false);
  const easterEggStartTimeRef = useRef<number | null>(null);
  const easterEggActiveRef = useRef(false);

  // Score-5 easter egg tracking refs
  const score5EasterEggTriggeredRef = useRef(false);
  const score5EasterEggStartTimeRef = useRef<number | null>(null);
  const score5EasterEggActiveRef = useRef(false);

  // Score-10 easter egg tracking refs
  const score10EasterEggTriggeredRef = useRef(false);
  const score10EasterEggStartTimeRef = useRef<number | null>(null);
  const score10EasterEggActiveRef = useRef(false);

  // Score-17 easter egg tracking refs
  const score17EasterEggTriggeredRef = useRef(false);
  const score17EasterEggStartTimeRef = useRef<number | null>(null);
  const score17EasterEggActiveRef = useRef(false);

  const flap = useCallback(() => {
    const s = stateRef.current;
    if (s.status === 'idle') {
      s.status = 'playing';
      s.playerVelocity = FLAP_STRENGTH;
      setGameStatus('playing');
    } else if (s.status === 'playing') {
      s.playerVelocity = FLAP_STRENGTH;
    }
  }, []);

  const restart = useCallback(() => {
    const s = stateRef.current;
    s.status = 'idle';
    s.playerY = CANVAS_HEIGHT / 2;
    s.playerVelocity = 0;
    s.obstacles = [];
    s.bgOffset = 0;
    s.score = 0;
    s.nextObstacleId = 0;
    s.framesSinceLastObstacle = 0;
    // Reset easter egg state for new session
    easterEggTriggeredRef.current = false;
    easterEggStartTimeRef.current = null;
    easterEggActiveRef.current = false;
    // Reset score-5 easter egg state
    score5EasterEggTriggeredRef.current = false;
    score5EasterEggStartTimeRef.current = null;
    score5EasterEggActiveRef.current = false;
    // Reset score-10 easter egg state
    score10EasterEggTriggeredRef.current = false;
    score10EasterEggStartTimeRef.current = null;
    score10EasterEggActiveRef.current = false;
    // Reset score-17 easter egg state
    score17EasterEggTriggeredRef.current = false;
    score17EasterEggStartTimeRef.current = null;
    score17EasterEggActiveRef.current = false;
    setGameStatus('idle');
    setScore(0);
    setIsEasterEggActive(false);
    setIsScore5EasterEggActive(false);
    setIsScore10EasterEggActive(false);
    setIsScore17EasterEggActive(false);
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.status !== 'playing') return;

    const now = performance.now();

    // Check if score-5 easter egg should activate
    if (!score5EasterEggTriggeredRef.current && s.score >= EASTER_EGG_SCORE_5) {
      score5EasterEggTriggeredRef.current = true;
      score5EasterEggStartTimeRef.current = now;
      score5EasterEggActiveRef.current = true;
      setIsScore5EasterEggActive(true);
    }

    // Check if score-5 easter egg should deactivate
    if (
      score5EasterEggActiveRef.current &&
      score5EasterEggStartTimeRef.current !== null &&
      now - score5EasterEggStartTimeRef.current >= EASTER_EGG_DURATION_MS
    ) {
      score5EasterEggActiveRef.current = false;
      setIsScore5EasterEggActive(false);
    }

    // Check if score-10 easter egg should activate
    if (!score10EasterEggTriggeredRef.current && s.score >= EASTER_EGG_SCORE_10) {
      score10EasterEggTriggeredRef.current = true;
      score10EasterEggStartTimeRef.current = now;
      score10EasterEggActiveRef.current = true;
      setIsScore10EasterEggActive(true);
    }

    // Check if score-10 easter egg should deactivate
    if (
      score10EasterEggActiveRef.current &&
      score10EasterEggStartTimeRef.current !== null &&
      now - score10EasterEggStartTimeRef.current >= EASTER_EGG_DURATION_MS
    ) {
      score10EasterEggActiveRef.current = false;
      setIsScore10EasterEggActive(false);
    }

    // Check if score-15 easter egg should activate
    if (!easterEggTriggeredRef.current && s.score >= EASTER_EGG_SCORE) {
      easterEggTriggeredRef.current = true;
      easterEggStartTimeRef.current = now;
      easterEggActiveRef.current = true;
      setIsEasterEggActive(true);
    }

    // Check if score-15 easter egg should deactivate
    if (
      easterEggActiveRef.current &&
      easterEggStartTimeRef.current !== null &&
      now - easterEggStartTimeRef.current >= EASTER_EGG_DURATION_MS
    ) {
      easterEggActiveRef.current = false;
      setIsEasterEggActive(false);
    }

    // Check if score-17 easter egg should activate
    if (!score17EasterEggTriggeredRef.current && s.score >= EASTER_EGG_SCORE_17) {
      score17EasterEggTriggeredRef.current = true;
      score17EasterEggStartTimeRef.current = now;
      score17EasterEggActiveRef.current = true;
      setIsScore17EasterEggActive(true);
    }

    // Check if score-17 easter egg should deactivate
    if (
      score17EasterEggActiveRef.current &&
      score17EasterEggStartTimeRef.current !== null &&
      now - score17EasterEggStartTimeRef.current >= EASTER_EGG_DURATION_MS
    ) {
      score17EasterEggActiveRef.current = false;
      setIsScore17EasterEggActive(false);
    }

    const isAnyEasterEggActive =
      easterEggActiveRef.current ||
      score5EasterEggActiveRef.current ||
      score10EasterEggActiveRef.current ||
      score17EasterEggActiveRef.current;
    const baseSpeed = OBSTACLE_SPEED_BASE + Math.floor(s.score / 10) * 0.3;
    const speed = isAnyEasterEggActive
      ? baseSpeed * EASTER_EGG_SPEED_FACTOR
      : baseSpeed;

    // Physics
    s.playerVelocity += GRAVITY;
    s.playerY += s.playerVelocity;

    // Background scroll
    s.bgOffset = (s.bgOffset + speed * 0.5) % CANVAS_WIDTH;

    // Spawn obstacles
    s.framesSinceLastObstacle++;
    if (s.framesSinceLastObstacle >= OBSTACLE_INTERVAL / speed) {
      const minGapY = 80;
      const maxGapY = CANVAS_HEIGHT - 80 - GAP_SIZE;
      const gapY = Math.floor(Math.random() * (maxGapY - minGapY)) + minGapY;
      s.obstacles.push({
        id: s.nextObstacleId++,
        x: CANVAS_WIDTH + OBSTACLE_WIDTH,
        gapY,
        gapSize: GAP_SIZE,
        topComment: getRandomComment(),
        bottomComment: getRandomComment(),
        passed: false,
      });
      s.framesSinceLastObstacle = 0;
    }

    // Move obstacles
    s.obstacles = s.obstacles
      .map(obs => ({ ...obs, x: obs.x - speed }))
      .filter(obs => obs.x > -OBSTACLE_WIDTH - 20);

    // Score
    let newScore = s.score;
    s.obstacles.forEach(obs => {
      if (!obs.passed && obs.x + OBSTACLE_WIDTH / 2 < PLAYER_X) {
        obs.passed = true;
        newScore++;
      }
    });
    if (newScore !== s.score) {
      s.score = newScore;
      setScore(newScore);
    }

    // Collision detection
    const playerLeft = PLAYER_X - PLAYER_SIZE / 2 + 6;
    const playerRight = PLAYER_X + PLAYER_SIZE / 2 - 6;
    const playerTop = s.playerY - PLAYER_SIZE / 2 + 6;
    const playerBottom = s.playerY + PLAYER_SIZE / 2 - 6;

    // Ground/ceiling
    if (playerBottom >= CANVAS_HEIGHT - 20 || playerTop <= 0) {
      triggerGameOver(s, newScore);
      return;
    }

    // Obstacle collision
    for (const obs of s.obstacles) {
      const obsLeft = obs.x - OBSTACLE_WIDTH / 2;
      const obsRight = obs.x + OBSTACLE_WIDTH / 2;
      if (playerRight > obsLeft && playerLeft < obsRight) {
        const topObsBottom = obs.gapY;
        const bottomObsTop = obs.gapY + obs.gapSize;
        if (playerTop < topObsBottom || playerBottom > bottomObsTop) {
          triggerGameOver(s, newScore);
          return;
        }
      }
    }
  }, []);

  function triggerGameOver(s: typeof stateRef.current, finalScore: number) {
    s.status = 'gameover';
    setGameStatus('gameover');
    setHighScore(prev => Math.max(prev, finalScore));
    // Deactivate easter eggs on game over
    if (easterEggActiveRef.current) {
      easterEggActiveRef.current = false;
      setIsEasterEggActive(false);
    }
    if (score5EasterEggActiveRef.current) {
      score5EasterEggActiveRef.current = false;
      setIsScore5EasterEggActive(false);
    }
    if (score10EasterEggActiveRef.current) {
      score10EasterEggActiveRef.current = false;
      setIsScore10EasterEggActive(false);
    }
    if (score17EasterEggActiveRef.current) {
      score17EasterEggActiveRef.current = false;
      setIsScore17EasterEggActive(false);
    }
  }

  return {
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
  };
}
