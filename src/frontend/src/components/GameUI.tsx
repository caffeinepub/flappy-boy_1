import React from "react";
import type { GameStatus } from "../hooks/useGameState";

const ADMIN_LEVELS = [0, 1, 2, 3, 4, 5, 10, 15, 17, 20, 21];

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
  isScore17EasterEggActive?: boolean;
  isScore20EasterEggActive?: boolean;
  isLevel21Active?: boolean;
  // Auth + admin props
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  selectedLevel?: number;
  loginStatus?: string;
  onLogin?: () => void;
  onLogout?: () => void;
  onSelectLevel?: (level: number) => void;
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
  isScore17EasterEggActive = false,
  isScore20EasterEggActive = false,
  isLevel21Active = false,
  isAuthenticated = false,
  isAdmin = false,
  selectedLevel = 0,
  loginStatus = "idle",
  onLogin,
  onLogout,
  onSelectLevel,
}: GameUIProps) {
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{ width: canvasWidth, height: canvasHeight }}
    >
      {/* Login / Logout button — floating top-right */}
      <div
        className="absolute top-2 right-2 pointer-events-auto"
        style={{ zIndex: 20 }}
      >
        <button
          type="button"
          data-ocid="auth.button"
          disabled={isLoggingIn}
          onClick={(e) => {
            e.stopPropagation();
            if (isAuthenticated) {
              onLogout?.();
            } else {
              onLogin?.();
            }
          }}
          style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: isAuthenticated ? "#ff8c00" : "#ffd700",
            background: "rgba(10,4,20,0.75)",
            border: `1px solid ${isAuthenticated ? "rgba(255,140,0,0.4)" : "rgba(255,215,0,0.3)"}`,
            borderRadius: "6px",
            padding: "4px 10px",
            cursor: isLoggingIn ? "default" : "pointer",
            opacity: isLoggingIn ? 0.6 : 1,
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            transition: "all 0.2s ease",
          }}
        >
          {isLoggingIn ? "Logging in..." : isAuthenticated ? "Logout" : "Login"}
        </button>
      </div>

      {/* Score display during gameplay */}
      {gameStatus === "playing" && (
        <div className="absolute top-4 left-0 right-0 flex justify-center">
          <div
            className="px-5 py-1 rounded-full"
            style={{
              background: "rgba(0,0,0,0.55)",
              border: "2px solid #ff8c00",
              boxShadow: "0 0 12px rgba(255,140,0,0.5)",
            }}
          >
            <span
              style={{
                fontFamily: "Bangers, cursive",
                fontSize: "2.2rem",
                color: "#ffd700",
                letterSpacing: "0.08em",
                textShadow: "2px 2px 0 #cc2200, 0 0 10px rgba(255,215,0,0.6)",
              }}
            >
              {score}
            </span>
          </div>
        </div>
      )}

      {/* Score-5 easter egg overlay — "ok now, you need to stop" */}
      {isScore5EasterEggActive && gameStatus === "playing" && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.45)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "relative",
              textAlign: "center",
              padding: "0 16px",
            }}
          >
            {/* Glow backdrop */}
            <div
              style={{
                position: "absolute",
                inset: "-20px -30px",
                background:
                  "radial-gradient(ellipse at center, rgba(0,180,255,0.35) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(8px)",
              }}
            />
            <div
              style={{
                fontFamily: "Bangers, cursive",
                fontSize: "clamp(1.6rem, 6vw, 2.6rem)",
                lineHeight: 1.15,
                color: "#ffd700",
                textShadow:
                  "3px 3px 0 #005599, -1px -1px 0 #003366, 0 0 24px rgba(0,180,255,0.9), 0 0 48px rgba(255,215,0,0.5)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                position: "relative",
                maxWidth: "400px",
                wordBreak: "break-word",
              }}
            >
              ok now, you need to stop
            </div>
            <div
              style={{
                marginTop: "10px",
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 800,
                color: "#7dd3fc",
                letterSpacing: "0.04em",
                position: "relative",
                textShadow: "1px 1px 0 rgba(0,0,0,0.8)",
              }}
            >
              🛑 seriously tho...
            </div>
          </div>
        </div>
      )}

      {/* Score-10 easter egg overlay — "HOW ARE YOU STILL GOING" */}
      {isScore10EasterEggActive && gameStatus === "playing" && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.45)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "relative",
              textAlign: "center",
              padding: "0 16px",
            }}
          >
            {/* Glow backdrop */}
            <div
              style={{
                position: "absolute",
                inset: "-20px -30px",
                background:
                  "radial-gradient(ellipse at center, rgba(0,255,120,0.35) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(8px)",
              }}
            />
            <div
              style={{
                fontFamily: "Bangers, cursive",
                fontSize: "clamp(1.6rem, 6vw, 2.6rem)",
                lineHeight: 1.15,
                color: "#ffd700",
                textShadow:
                  "3px 3px 0 #006622, -1px -1px 0 #003311, 0 0 24px rgba(0,255,120,0.9), 0 0 48px rgba(255,215,0,0.5)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                position: "relative",
                maxWidth: "400px",
                wordBreak: "break-word",
              }}
            >
              HOW ARE YOU STILL GOING
            </div>
            <div
              style={{
                marginTop: "10px",
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 800,
                color: "#86efac",
                letterSpacing: "0.04em",
                position: "relative",
                textShadow: "1px 1px 0 rgba(0,0,0,0.8)",
              }}
            >
              😱 this is actually impressive...
            </div>
          </div>
        </div>
      )}

      {/* Easter egg overlay — score 15 slowdown */}
      {isEasterEggActive && gameStatus === "playing" && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.45)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "relative",
              textAlign: "center",
              padding: "0 16px",
            }}
          >
            {/* Glow backdrop */}
            <div
              style={{
                position: "absolute",
                inset: "-20px -30px",
                background:
                  "radial-gradient(ellipse at center, rgba(255,60,0,0.35) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(8px)",
              }}
            />
            <div
              style={{
                fontFamily: "Bangers, cursive",
                fontSize: "clamp(1.6rem, 6vw, 2.6rem)",
                lineHeight: 1.15,
                color: "#ffd700",
                textShadow:
                  "3px 3px 0 #cc2200, -1px -1px 0 #8b0000, 0 0 24px rgba(255,80,0,0.9), 0 0 48px rgba(255,215,0,0.5)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                position: "relative",
                maxWidth: "400px",
                wordBreak: "break-word",
              }}
            >
              aint no way you beat my high score!
            </div>
            <div
              style={{
                marginTop: "10px",
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 800,
                color: "#ffb347",
                letterSpacing: "0.04em",
                position: "relative",
                textShadow: "1px 1px 0 rgba(0,0,0,0.8)",
              }}
            >
              😤 keep flying tho...
            </div>
          </div>
        </div>
      )}

      {/* Score-17 easter egg overlay — "looks like im going to have to make this hard for you" */}
      {isScore17EasterEggActive && gameStatus === "playing" && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.5)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "relative",
              textAlign: "center",
              padding: "0 16px",
            }}
          >
            {/* Glow backdrop */}
            <div
              style={{
                position: "absolute",
                inset: "-20px -30px",
                background:
                  "radial-gradient(ellipse at center, rgba(180,0,255,0.35) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(8px)",
              }}
            />
            <div
              style={{
                fontFamily: "Bangers, cursive",
                fontSize: "clamp(1.6rem, 6vw, 2.6rem)",
                lineHeight: 1.15,
                color: "#ffd700",
                textShadow:
                  "3px 3px 0 #6600aa, -1px -1px 0 #330066, 0 0 24px rgba(200,0,255,0.9), 0 0 48px rgba(255,215,0,0.5)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                position: "relative",
                maxWidth: "420px",
                wordBreak: "break-word",
              }}
            >
              looks like im going to have to make this hard for you
            </div>
            <div
              style={{
                marginTop: "10px",
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 800,
                color: "#d8b4fe",
                letterSpacing: "0.04em",
                position: "relative",
                textShadow: "1px 1px 0 rgba(0,0,0,0.8)",
              }}
            >
              😈 challenge accepted?
            </div>
          </div>
        </div>
      )}

      {/* Score-20 easter egg overlay — "Still going? I'll change that" */}
      {isScore20EasterEggActive && gameStatus === "playing" && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.5)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "relative",
              textAlign: "center",
              padding: "0 16px",
            }}
          >
            {/* Glow backdrop */}
            <div
              style={{
                position: "absolute",
                inset: "-20px -30px",
                background:
                  "radial-gradient(ellipse at center, rgba(255,30,80,0.4) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(8px)",
              }}
            />
            <div
              style={{
                fontFamily: "Bangers, cursive",
                fontSize: "clamp(1.6rem, 6vw, 2.6rem)",
                lineHeight: 1.15,
                color: "#ffd700",
                textShadow:
                  "3px 3px 0 #aa0022, -1px -1px 0 #660011, 0 0 24px rgba(255,30,80,0.9), 0 0 48px rgba(255,215,0,0.5)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                position: "relative",
                maxWidth: "420px",
                wordBreak: "break-word",
              }}
            >
              Still going? I'll change that
            </div>
            <div
              style={{
                marginTop: "10px",
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 800,
                color: "#fca5a5",
                letterSpacing: "0.04em",
                position: "relative",
                textShadow: "1px 1px 0 rgba(0,0,0,0.8)",
              }}
            >
              😤 oh you thought this was over?
            </div>
          </div>
        </div>
      )}

      {/* Level 21 boss intro overlay */}
      {isLevel21Active && gameStatus === "playing" && score === 21 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.55)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "relative",
              textAlign: "center",
              padding: "0 16px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-20px -30px",
                background:
                  "radial-gradient(ellipse at center, rgba(200,0,0,0.4) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(8px)",
              }}
            />
            <div
              style={{
                fontFamily: "Bangers, cursive",
                fontSize: "clamp(1.8rem, 7vw, 3rem)",
                lineHeight: 1.1,
                color: "#ff2200",
                textShadow:
                  "3px 3px 0 #8b0000, 0 0 28px rgba(255,0,0,1), 0 0 56px rgba(255,100,0,0.6)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                position: "relative",
                maxWidth: "420px",
                wordBreak: "break-word",
              }}
            >
              IT IS WATCHING YOU
            </div>
            <div
              style={{
                marginTop: "10px",
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.9rem",
                fontWeight: 800,
                color: "#fca5a5",
                letterSpacing: "0.04em",
                position: "relative",
                textShadow: "1px 1px 0 rgba(0,0,0,0.9)",
              }}
            >
              👁 dodge the laser beams...
            </div>
          </div>
        </div>
      )}

      {/* Start screen */}
      {gameStatus === "idle" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
          style={{ background: "rgba(10,4,20,0.82)" }}
          onClick={onStart}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onStart();
          }}
        >
          {/* Title */}
          <div className="mb-2 text-center">
            <div
              style={{
                fontFamily: "Bangers, cursive",
                fontSize: "4.5rem",
                lineHeight: 1,
                color: "#ffd700",
                textShadow: "4px 4px 0 #cc2200, 0 0 20px rgba(255,215,0,0.7)",
                letterSpacing: "0.06em",
              }}
            >
              FLAPPY
            </div>
            <div
              style={{
                fontFamily: "Bangers, cursive",
                fontSize: "4.5rem",
                lineHeight: 1,
                color: "#ff6b00",
                textShadow: "4px 4px 0 #8b0000, 0 0 20px rgba(255,107,0,0.7)",
                letterSpacing: "0.06em",
              }}
            >
              BOY
            </div>
          </div>

          {/* High score */}
          {highScore > 0 && (
            <div
              className="mb-4"
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: "1rem",
                fontWeight: 800,
                color: "#ffd700",
                textShadow: "1px 1px 0 rgba(0,0,0,0.8)",
                letterSpacing: "0.04em",
              }}
            >
              BEST: {highScore}
            </div>
          )}

          {/* Start button */}
          <button
            type="button"
            className="pointer-events-auto mt-2 px-8 py-3 rounded-full"
            style={{
              fontFamily: "Bangers, cursive",
              fontSize: "1.8rem",
              letterSpacing: "0.1em",
              color: "#1a0a2e",
              background: "linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)",
              border: "3px solid #ff6b00",
              boxShadow: "0 4px 20px rgba(255,140,0,0.6), 0 2px 0 #8b0000",
              cursor: "pointer",
              animation: "pulse-scale 1.5s ease-in-out infinite",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
          >
            TAP TO FLY
          </button>

          {/* Instructions */}
          <div
            className="mt-6 text-center px-8"
            style={{
              fontFamily: "Nunito, sans-serif",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "rgba(255,215,0,0.7)",
              lineHeight: 1.6,
            }}
          >
            <div>SPACE / TAP to flap</div>
            <div>Dodge the haters!</div>
          </div>

          {/* Admin level picker — only visible to admin on idle screen */}
          {isAdmin && (
            <div
              data-ocid="admin.level_picker.panel"
              className="pointer-events-auto mt-5"
              style={{
                background: "rgba(10,4,20,0.88)",
                border: "1px solid rgba(255,140,0,0.35)",
                borderRadius: "10px",
                padding: "10px 14px",
                maxWidth: "340px",
                width: "100%",
                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,215,0,0.06)",
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  color: "#ff8c00",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  textShadow: "0 0 8px rgba(255,140,0,0.5)",
                }}
              >
                ⚙ ADMIN: Start from level
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ADMIN_LEVELS.map((lvl, idx) => (
                  <button
                    key={lvl}
                    type="button"
                    data-ocid={`admin.level.item.${idx + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLevel?.(lvl);
                    }}
                    style={{
                      fontFamily: "Bangers, cursive",
                      fontSize: "1rem",
                      letterSpacing: "0.05em",
                      color: selectedLevel === lvl ? "#1a0a2e" : "#ffd700",
                      background:
                        selectedLevel === lvl
                          ? "linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)"
                          : "rgba(255,215,0,0.08)",
                      border: `1.5px solid ${selectedLevel === lvl ? "#ff8c00" : "rgba(255,215,0,0.25)"}`,
                      borderRadius: "6px",
                      padding: "3px 10px",
                      cursor: "pointer",
                      minWidth: "36px",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                      boxShadow:
                        selectedLevel === lvl
                          ? "0 2px 10px rgba(255,140,0,0.5)"
                          : "none",
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Game over screen */}
      {gameStatus === "gameover" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
          style={{ background: "rgba(10,4,20,0.88)" }}
        >
          <div
            style={{
              fontFamily: "Bangers, cursive",
              fontSize: "3.5rem",
              lineHeight: 1,
              color: "#ff2200",
              textShadow: "4px 4px 0 #8b0000, 0 0 20px rgba(255,34,0,0.7)",
              letterSpacing: "0.06em",
            }}
          >
            GAME OVER
          </div>

          <div
            className="mt-3 mb-1"
            style={{
              fontFamily: "Nunito, sans-serif",
              fontSize: "1rem",
              fontWeight: 800,
              color: "rgba(255,215,0,0.8)",
              letterSpacing: "0.04em",
            }}
          >
            SCORE
          </div>
          <div
            style={{
              fontFamily: "Bangers, cursive",
              fontSize: "3rem",
              color: "#ffd700",
              textShadow: "3px 3px 0 #cc2200, 0 0 16px rgba(255,215,0,0.6)",
              letterSpacing: "0.08em",
            }}
          >
            {score}
          </div>

          {highScore > 0 && (
            <div
              className="mt-1 mb-4"
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 800,
                color: "#ff8c00",
                letterSpacing: "0.04em",
              }}
            >
              BEST: {highScore}
            </div>
          )}

          <button
            type="button"
            className="pointer-events-auto mt-2 px-8 py-3 rounded-full"
            style={{
              fontFamily: "Bangers, cursive",
              fontSize: "1.8rem",
              letterSpacing: "0.1em",
              color: "#1a0a2e",
              background: "linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)",
              border: "3px solid #ff6b00",
              boxShadow: "0 4px 20px rgba(255,140,0,0.6), 0 2px 0 #8b0000",
              cursor: "pointer",
            }}
            onClick={onRestart}
          >
            TRY AGAIN
          </button>
        </div>
      )}

      {/* Footer */}
      {gameStatus === "idle" && (
        <div
          className="absolute bottom-2 left-0 right-0 flex justify-center"
          style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: "0.65rem",
            fontWeight: 600,
            color: "rgba(255,215,0,0.4)",
            letterSpacing: "0.03em",
          }}
        >
          Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "unknown-app")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto ml-1"
            style={{
              color: "rgba(255,140,0,0.5)",
              textDecoration: "underline",
            }}
          >
            caffeine.ai
          </a>
        </div>
      )}
    </div>
  );
}
