import React from 'react';
import { GameStatus } from '../hooks/useGameState';

interface GameUIProps {
  gameStatus: GameStatus;
  score: number;
  highScore: number;
  onStart: () => void;
  onRestart: () => void;
  canvasWidth: number;
  canvasHeight: number;
  isEasterEggActive?: boolean;
  isScore5EasterEggActive?: boolean;
  isScore10EasterEggActive?: boolean;
}

export default function GameUI({
  gameStatus,
  score,
  highScore,
  onStart,
  onRestart,
  canvasWidth,
  canvasHeight,
  isEasterEggActive = false,
  isScore5EasterEggActive = false,
  isScore10EasterEggActive = false,
}: GameUIProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{ width: canvasWidth, height: canvasHeight }}
    >
      {/* Score display during gameplay */}
      {gameStatus === 'playing' && (
        <div className="absolute top-4 left-0 right-0 flex justify-center">
          <div
            className="px-5 py-1 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.55)',
              border: '2px solid #ff8c00',
              boxShadow: '0 0 12px rgba(255,140,0,0.5)',
            }}
          >
            <span
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '2.2rem',
                color: '#ffd700',
                letterSpacing: '0.08em',
                textShadow: '2px 2px 0 #cc2200, 0 0 10px rgba(255,215,0,0.6)',
              }}
            >
              {score}
            </span>
          </div>
        </div>
      )}

      {/* Score-5 easter egg overlay — "ok now, you need to stop" */}
      {isScore5EasterEggActive && gameStatus === 'playing' && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.45)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: 'relative',
              textAlign: 'center',
              padding: '0 16px',
            }}
          >
            {/* Glow backdrop */}
            <div
              style={{
                position: 'absolute',
                inset: '-20px -30px',
                background: 'radial-gradient(ellipse at center, rgba(0,180,255,0.35) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(8px)',
              }}
            />
            <div
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: 'clamp(1.6rem, 6vw, 2.6rem)',
                lineHeight: 1.15,
                color: '#ffd700',
                textShadow:
                  '3px 3px 0 #005599, -1px -1px 0 #003366, 0 0 24px rgba(0,180,255,0.9), 0 0 48px rgba(255,215,0,0.5)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                position: 'relative',
                maxWidth: '400px',
                wordBreak: 'break-word',
              }}
            >
              ok now, you need to stop
            </div>
            <div
              style={{
                marginTop: '10px',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#7dd3fc',
                letterSpacing: '0.04em',
                position: 'relative',
                textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
              }}
            >
              🛑 seriously tho...
            </div>
          </div>
        </div>
      )}

      {/* Score-10 easter egg overlay — "HOW ARE YOU STILL GOING" */}
      {isScore10EasterEggActive && gameStatus === 'playing' && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.45)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: 'relative',
              textAlign: 'center',
              padding: '0 16px',
            }}
          >
            {/* Glow backdrop */}
            <div
              style={{
                position: 'absolute',
                inset: '-20px -30px',
                background: 'radial-gradient(ellipse at center, rgba(0,255,120,0.35) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(8px)',
              }}
            />
            <div
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: 'clamp(1.6rem, 6vw, 2.6rem)',
                lineHeight: 1.15,
                color: '#ffd700',
                textShadow:
                  '3px 3px 0 #006622, -1px -1px 0 #003311, 0 0 24px rgba(0,255,120,0.9), 0 0 48px rgba(255,215,0,0.5)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                position: 'relative',
                maxWidth: '400px',
                wordBreak: 'break-word',
              }}
            >
              HOW ARE YOU STILL GOING
            </div>
            <div
              style={{
                marginTop: '10px',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#86efac',
                letterSpacing: '0.04em',
                position: 'relative',
                textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
              }}
            >
              😱 this is actually impressive...
            </div>
          </div>
        </div>
      )}

      {/* Easter egg overlay — score 15 slowdown */}
      {isEasterEggActive && gameStatus === 'playing' && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.45)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: 'relative',
              textAlign: 'center',
              padding: '0 16px',
            }}
          >
            {/* Glow backdrop */}
            <div
              style={{
                position: 'absolute',
                inset: '-20px -30px',
                background: 'radial-gradient(ellipse at center, rgba(255,60,0,0.35) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(8px)',
              }}
            />
            <div
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: 'clamp(1.6rem, 6vw, 2.6rem)',
                lineHeight: 1.15,
                color: '#ffd700',
                textShadow:
                  '3px 3px 0 #cc2200, -1px -1px 0 #8b0000, 0 0 24px rgba(255,80,0,0.9), 0 0 48px rgba(255,215,0,0.5)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                position: 'relative',
                maxWidth: '400px',
                wordBreak: 'break-word',
              }}
            >
              aint no way you beat my high score!
            </div>
            <div
              style={{
                marginTop: '10px',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#ffb347',
                letterSpacing: '0.04em',
                position: 'relative',
                textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
              }}
            >
              😤 keep flying tho...
            </div>
          </div>
        </div>
      )}

      {/* Start screen */}
      {gameStatus === 'idle' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
          style={{ background: 'rgba(10,4,20,0.82)' }}
          onClick={onStart}
        >
          {/* Title */}
          <div className="mb-2 text-center">
            <div
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '4.5rem',
                lineHeight: 1,
                color: '#ffd700',
                textShadow: '4px 4px 0 #cc2200, 0 0 20px rgba(255,215,0,0.7)',
                letterSpacing: '0.06em',
              }}
            >
              FLAPPY
            </div>
            <div
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '4.5rem',
                lineHeight: 1,
                color: '#ff6b00',
                textShadow: '4px 4px 0 #8b0000, 0 0 20px rgba(255,107,0,0.7)',
                letterSpacing: '0.06em',
              }}
            >
              BOY
            </div>
          </div>

          {/* Subtitle */}
          <div
            className="mb-6 px-4 py-1 rounded-full text-center"
            style={{
              background: 'rgba(255,107,0,0.2)',
              border: '1px solid rgba(255,107,0,0.5)',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#ffb347',
              letterSpacing: '0.05em',
            }}
          >
            Dodge the hate, keep flying! ✊
          </div>

          {/* Character preview area */}
          <div
            className="mb-6 rounded-2xl p-4 text-center"
            style={{
              background: 'rgba(255,107,0,0.1)',
              border: '2px solid rgba(255,140,0,0.4)',
            }}
          >
            <div style={{ fontSize: '3.5rem' }}>🧒🏿</div>
            <div
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#ff8c00',
                marginTop: '4px',
              }}
            >
              That's you!
            </div>
          </div>

          {/* Instructions */}
          <div
            className="mb-6 rounded-xl px-5 py-3 text-center"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,140,0,0.3)',
              maxWidth: '280px',
            }}
          >
            <div
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '1.1rem',
                color: '#ffd700',
                letterSpacing: '0.05em',
                marginBottom: '6px',
              }}
            >
              HOW TO PLAY
            </div>
            <div
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#ffb347',
                lineHeight: 1.6,
              }}
            >
              🖱️ <strong>Click</strong> or press <strong>SPACE</strong> to fly<br />
              💬 Dodge the negative comments<br />
              ⭐ Score points by passing through<br />
              🏆 Beat your high score!
            </div>
          </div>

          {/* Start button */}
          <button
            className="animate-pulse-scale"
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '1.8rem',
              letterSpacing: '0.1em',
              color: '#1a0a00',
              background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
              border: '3px solid #cc2200',
              borderRadius: '50px',
              padding: '10px 40px',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #8b0000, 0 0 20px rgba(255,215,0,0.5)',
              textShadow: '1px 1px 0 rgba(255,255,255,0.3)',
            }}
            onClick={onStart}
          >
            TAP TO START!
          </button>

          {highScore > 0 && (
            <div
              className="mt-4"
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#ffd700',
              }}
            >
              🏆 Best: {highScore}
            </div>
          )}
        </div>
      )}

      {/* Game Over screen */}
      {gameStatus === 'gameover' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
          style={{ background: 'rgba(10,4,20,0.88)' }}
        >
          <div
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '3.5rem',
              color: '#ff3300',
              textShadow: '3px 3px 0 #8b0000, 0 0 20px rgba(255,50,0,0.7)',
              letterSpacing: '0.08em',
              marginBottom: '4px',
            }}
          >
            GAME OVER
          </div>

          <div
            className="mb-2"
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 800,
              color: '#ffb347',
            }}
          >
            They got to you... 😔
          </div>

          <div
            className="mb-1 px-6 py-2 rounded-xl text-center"
            style={{
              background: 'rgba(255,215,0,0.12)',
              border: '2px solid rgba(255,215,0,0.4)',
            }}
          >
            <div
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '1rem',
                color: '#ffb347',
                letterSpacing: '0.05em',
              }}
            >
              SCORE
            </div>
            <div
              style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '3rem',
                color: '#ffd700',
                textShadow: '2px 2px 0 #cc2200',
                lineHeight: 1,
              }}
            >
              {score}
            </div>
          </div>

          {highScore > 0 && (
            <div
              className="mb-4"
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: score >= highScore ? '#ffd700' : '#ff8c00',
              }}
            >
              {score >= highScore ? '🏆 NEW HIGH SCORE!' : `🏆 Best: ${highScore}`}
            </div>
          )}

          <button
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '1.6rem',
              letterSpacing: '0.1em',
              color: '#1a0a00',
              background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
              border: '3px solid #cc2200',
              borderRadius: '50px',
              padding: '8px 36px',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #8b0000, 0 0 20px rgba(255,215,0,0.5)',
              textShadow: '1px 1px 0 rgba(255,255,255,0.3)',
            }}
            onClick={onRestart}
          >
            TRY AGAIN!
          </button>
        </div>
      )}
    </div>
  );
}
