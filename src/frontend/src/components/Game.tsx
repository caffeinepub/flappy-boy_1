import React, { useRef, useEffect, useCallback } from "react";
import { useGameState } from "../hooks/useGameState";
import GameUI from "./GameUI";

const BG_IMG_SRC = "/assets/generated/urban-background.dim_1600x600.png";

// Classic Flappy Bird pipe colors
const PIPE_GREEN = "#4EC853";
const PIPE_GREEN_DARK = "#2E8B2E";
const PIPE_GREEN_LIGHT = "#6FD96F";
const PIPE_CAP_EXTRA = 10; // extra width on each side for the cap/lip

// Dark skin tone palette
const SKIN_DARK = "#6B3A2A";
const SKIN_MID = "#8B5E3C";
const SKIN_SHADOW = "#4A2518";
const HAIR_COLOR = "#1A0A05";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const _prevVelocityRef = useRef<number>(0);
  const flapFlashRef = useRef<number>(0); // tracks recent flap for animation
  const lastTimeRef = useRef<number>(performance.now());

  const {
    stateRef,
    gameStatus,
    score,
    highScore,
    isEasterEggActive,
    isScore5EasterEggActive,
    isScore10EasterEggActive,
    isScore17EasterEggActive,
    isScore20EasterEggActive,
    isLevel21Active,
    flap,
    restart,
    tick,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PLAYER_X,
    PLAYER_SIZE,
    OBSTACLE_WIDTH,
    LASER_HEIGHT,
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    const eye = s.eyeBoss;
    const now = performance.now();

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw scrolling background
    const bgImg = bgImgRef.current;
    if (bgImg?.complete) {
      const bgW = CANVAS_WIDTH;
      const bgH = CANVAS_HEIGHT;
      const offset = s.bgOffset % bgW;
      ctx.drawImage(bgImg, -offset, 0, bgW, bgH);
      ctx.drawImage(bgImg, bgW - offset, 0, bgW, bgH);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      grad.addColorStop(0, "#87CEEB");
      grad.addColorStop(1, "#228B22");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Draw classic green pipes (skip in level 21)
    if (!isLevel21Active) {
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
          ctx.fillRect(
            obsLeft - capExtra,
            topHeight - capH,
            OBSTACLE_WIDTH + capExtra * 2,
            capH,
          );

          // Cap highlight
          ctx.fillStyle = PIPE_GREEN_LIGHT;
          ctx.fillRect(obsLeft - capExtra + 3, topHeight - capH, 8, capH);

          // Cap shadow
          ctx.fillStyle = PIPE_GREEN_DARK;
          ctx.fillRect(
            obsLeft + OBSTACLE_WIDTH + capExtra - 8,
            topHeight - capH,
            8,
            capH,
          );

          // Cap bottom border
          ctx.fillStyle = PIPE_GREEN_DARK;
          ctx.fillRect(
            obsLeft - capExtra,
            topHeight - 3,
            OBSTACLE_WIDTH + capExtra * 2,
            3,
          );

          // Pipe outline
          ctx.strokeStyle = PIPE_GREEN_DARK;
          ctx.lineWidth = 2;
          ctx.strokeRect(obsLeft, 0, OBSTACLE_WIDTH, topHeight - capH);
          ctx.strokeRect(
            obsLeft - capExtra,
            topHeight - capH,
            OBSTACLE_WIDTH + capExtra * 2,
            capH,
          );

          // Comment text on top pipe body
          if (topHeight > 60) {
            ctx.save();
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px Nunito, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(0,0,0,0.8)";
            ctx.shadowBlur = 3;
            const maxW = OBSTACLE_WIDTH - 10;
            const words = obs.topComment.split(" ");
            let line = "";
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
          ctx.fillRect(
            obsLeft - capExtra,
            bottomY,
            OBSTACLE_WIDTH + capExtra * 2,
            capH,
          );

          // Cap highlight
          ctx.fillStyle = PIPE_GREEN_LIGHT;
          ctx.fillRect(obsLeft - capExtra + 3, bottomY, 8, capH);

          // Cap shadow
          ctx.fillStyle = PIPE_GREEN_DARK;
          ctx.fillRect(
            obsLeft + OBSTACLE_WIDTH + capExtra - 8,
            bottomY,
            8,
            capH,
          );

          // Cap top border
          ctx.fillStyle = PIPE_GREEN_DARK;
          ctx.fillRect(
            obsLeft - capExtra,
            bottomY,
            OBSTACLE_WIDTH + capExtra * 2,
            3,
          );

          // Main pipe body
          ctx.fillStyle = PIPE_GREEN;
          ctx.fillRect(
            obsLeft,
            bottomY + capH,
            OBSTACLE_WIDTH,
            bottomHeight - capH,
          );

          // Pipe body highlight
          ctx.fillStyle = PIPE_GREEN_LIGHT;
          ctx.fillRect(obsLeft + 3, bottomY + capH, 6, bottomHeight - capH);

          // Pipe body shadow
          ctx.fillStyle = PIPE_GREEN_DARK;
          ctx.fillRect(
            obsLeft + OBSTACLE_WIDTH - 6,
            bottomY + capH,
            6,
            bottomHeight - capH,
          );

          // Pipe outline
          ctx.strokeStyle = PIPE_GREEN_DARK;
          ctx.lineWidth = 2;
          ctx.strokeRect(
            obsLeft - capExtra,
            bottomY,
            OBSTACLE_WIDTH + capExtra * 2,
            capH,
          );
          ctx.strokeRect(
            obsLeft,
            bottomY + capH,
            OBSTACLE_WIDTH,
            bottomHeight - capH,
          );

          // Comment text on bottom pipe body
          if (bottomHeight > 60) {
            ctx.save();
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px Nunito, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(0,0,0,0.8)";
            ctx.shadowBlur = 3;
            const maxW = OBSTACLE_WIDTH - 10;
            const words = obs.bottomComment.split(" ");
            let line = "";
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
    }

    // ---- LEVEL 21: Giant Eye Boss ----
    if (
      isLevel21Active &&
      eye.phase !== "inactive" &&
      eye.phase !== "waiting"
    ) {
      const ex = eye.eyeX;
      const ey = CANVAS_HEIGHT / 2;
      const scale = eye.eyeScale;
      const eyeRadius = 90 * scale;
      const irisRadius = eyeRadius * 0.52;
      const pupilRadius = irisRadius * 0.5;

      // Laser warning highlight (charging phase)
      if (eye.phase === "charging" && eye.phaseTimer > 0.3) {
        const chargeProgress = Math.min(
          (eye.phaseTimer - 0.3) / (1.1 - 0.3),
          1,
        );
        const pulseAlpha =
          0.15 + 0.2 * Math.sin(now * 0.006) + chargeProgress * 0.2;
        // Warning band across full canvas width
        ctx.save();
        const warningGrad = ctx.createLinearGradient(
          0,
          eye.targetY - LASER_HEIGHT,
          0,
          eye.targetY + LASER_HEIGHT,
        );
        warningGrad.addColorStop(0, "rgba(255,0,0,0)");
        warningGrad.addColorStop(0.3, `rgba(255,80,0,${pulseAlpha})`);
        warningGrad.addColorStop(0.5, `rgba(255,40,0,${pulseAlpha * 1.5})`);
        warningGrad.addColorStop(0.7, `rgba(255,80,0,${pulseAlpha})`);
        warningGrad.addColorStop(1, "rgba(255,0,0,0)");
        ctx.fillStyle = warningGrad;
        ctx.fillRect(
          0,
          eye.targetY - LASER_HEIGHT * 2,
          CANVAS_WIDTH,
          LASER_HEIGHT * 4,
        );

        // Dashed border on warning zone
        ctx.strokeStyle = `rgba(255,60,0,${0.5 + chargeProgress * 0.4})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([12, 6]);
        ctx.strokeRect(
          0,
          eye.targetY - LASER_HEIGHT,
          CANVAS_WIDTH,
          LASER_HEIGHT * 2,
        );
        ctx.setLineDash([]);

        // "DANGER" text
        ctx.font = `bold ${Math.round(12 + chargeProgress * 4)}px Nunito, sans-serif`;
        ctx.fillStyle = `rgba(255,100,0,${0.6 + chargeProgress * 0.4})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(255,0,0,0.9)";
        ctx.shadowBlur = 8;
        ctx.fillText("⚠ DANGER ZONE ⚠", CANVAS_WIDTH / 2, eye.targetY);
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // Laser beam (firing phase)
      if (eye.phase === "firing") {
        const fireProgress = eye.phaseTimer / 0.9;
        const beamAlpha = Math.min(fireProgress * 3, 1);
        ctx.save();

        // Outer glow
        const laserGrad = ctx.createLinearGradient(
          0,
          eye.targetY - LASER_HEIGHT * 2.5,
          0,
          eye.targetY + LASER_HEIGHT * 2.5,
        );
        laserGrad.addColorStop(0, "rgba(255,0,0,0)");
        laserGrad.addColorStop(0.25, `rgba(255,60,0,${0.4 * beamAlpha})`);
        laserGrad.addColorStop(0.5, `rgba(255,0,0,${0.7 * beamAlpha})`);
        laserGrad.addColorStop(0.75, `rgba(255,60,0,${0.4 * beamAlpha})`);
        laserGrad.addColorStop(1, "rgba(255,0,0,0)");
        ctx.fillStyle = laserGrad;
        ctx.fillRect(
          0,
          eye.targetY - LASER_HEIGHT * 2.5,
          CANVAS_WIDTH,
          LASER_HEIGHT * 5,
        );

        // Core beam (bright white-red center)
        const coreGrad = ctx.createLinearGradient(
          0,
          eye.targetY - LASER_HEIGHT * 0.5,
          0,
          eye.targetY + LASER_HEIGHT * 0.5,
        );
        coreGrad.addColorStop(0, `rgba(255,255,200,${beamAlpha})`);
        coreGrad.addColorStop(0.5, `rgba(255,60,40,${beamAlpha})`);
        coreGrad.addColorStop(1, `rgba(255,255,200,${beamAlpha})`);
        ctx.fillStyle = coreGrad;
        ctx.fillRect(
          0,
          eye.targetY - LASER_HEIGHT * 0.5,
          CANVAS_WIDTH,
          LASER_HEIGHT,
        );

        // Scanline flicker
        ctx.fillStyle = `rgba(255,200,100,${0.15 * beamAlpha * (0.5 + 0.5 * Math.sin(now * 0.03))})`;
        ctx.fillRect(0, eye.targetY - 3, CANVAS_WIDTH, 6);

        ctx.restore();
      }

      if (eyeRadius > 5) {
        ctx.save();
        ctx.translate(ex, ey);

        // Creepy red glow aura behind eye
        const glowPulse = 0.5 + 0.5 * Math.sin(now * 0.003);
        const auraGrad = ctx.createRadialGradient(
          0,
          0,
          eyeRadius * 0.5,
          0,
          0,
          eyeRadius * 2.2,
        );
        auraGrad.addColorStop(0, `rgba(200,0,0,${0.35 * glowPulse * scale})`);
        auraGrad.addColorStop(0.5, `rgba(180,0,50,${0.18 * scale})`);
        auraGrad.addColorStop(1, "rgba(100,0,0,0)");
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(0, 0, eyeRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Eyelid clipping region (eye shape — almond/ellipse)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, 0, eyeRadius, eyeRadius * 0.7, 0, 0, Math.PI * 2);
        ctx.clip();

        // White sclera
        const scleraGrad = ctx.createRadialGradient(
          -eyeRadius * 0.2,
          -eyeRadius * 0.2,
          0,
          0,
          0,
          eyeRadius,
        );
        scleraGrad.addColorStop(0, "#fff9f0");
        scleraGrad.addColorStop(0.7, "#f0e0d0");
        scleraGrad.addColorStop(1, "#d0a090");
        ctx.fillStyle = scleraGrad;
        ctx.fillRect(-eyeRadius, -eyeRadius, eyeRadius * 2, eyeRadius * 2);

        // Blood veins
        ctx.strokeStyle = "rgba(200,30,30,0.55)";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + Math.sin(now * 0.001 + i) * 0.1;
          const startR = irisRadius * 1.05;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * startR, Math.sin(angle) * startR * 0.7);
          const cp1x = Math.cos(angle + 0.3) * (startR + 15);
          const cp1y = Math.sin(angle + 0.3) * (startR + 15) * 0.7;
          const endX = Math.cos(angle + 0.1) * (eyeRadius - 5);
          const endY = Math.sin(angle + 0.1) * (eyeRadius * 0.65);
          ctx.quadraticCurveTo(cp1x, cp1y, endX, endY);
          ctx.stroke();
        }

        // Iris (deep red / glowing)
        const irisGrad = ctx.createRadialGradient(
          -irisRadius * 0.2,
          -irisRadius * 0.2,
          0,
          0,
          0,
          irisRadius,
        );
        irisGrad.addColorStop(0, "#ff3000");
        irisGrad.addColorStop(0.4, "#cc0000");
        irisGrad.addColorStop(0.75, "#800000");
        irisGrad.addColorStop(1, "#3a0000");
        ctx.beginPath();
        ctx.arc(0, 0, irisRadius, 0, Math.PI * 2);
        ctx.fillStyle = irisGrad;
        ctx.fill();

        // Iris ring detail
        ctx.strokeStyle = "rgba(255,80,0,0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, irisRadius * 0.85, 0, Math.PI * 2);
        ctx.stroke();

        // Pupil (black vertical slit, animates when charging/firing)
        const pupilStretch =
          eye.phase === "charging"
            ? 0.5 + eye.phaseTimer * 0.2
            : eye.phase === "firing"
              ? 2.5
              : 1;
        ctx.save();
        ctx.scale(1, Math.min(pupilStretch, 2.8));
        const pupilGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, pupilRadius);
        pupilGrad.addColorStop(0, "#000000");
        pupilGrad.addColorStop(0.8, "#110000");
        pupilGrad.addColorStop(1, "#200000");
        ctx.beginPath();
        ctx.arc(0, 0, pupilRadius, 0, Math.PI * 2);
        ctx.fillStyle = pupilGrad;
        ctx.fill();
        ctx.restore();

        // Eye shine / reflection
        ctx.beginPath();
        ctx.arc(
          -irisRadius * 0.3,
          -irisRadius * 0.3,
          irisRadius * 0.18,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fill();

        // Glowing red core effect when firing
        if (eye.phase === "firing" || eye.phase === "charging") {
          const fireGlowAlpha =
            eye.phase === "firing" ? 0.7 : (eye.phaseTimer / 1.4) * 0.5;
          const innerGlow = ctx.createRadialGradient(
            0,
            0,
            0,
            0,
            0,
            irisRadius * 0.6,
          );
          innerGlow.addColorStop(0, `rgba(255,200,0,${fireGlowAlpha})`);
          innerGlow.addColorStop(0.5, `rgba(255,60,0,${fireGlowAlpha * 0.6})`);
          innerGlow.addColorStop(1, "rgba(255,0,0,0)");
          ctx.beginPath();
          ctx.arc(0, 0, irisRadius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = innerGlow;
          ctx.fill();
        }

        ctx.restore(); // restore from ellipse clip

        // Eyelid outline (almond shape)
        ctx.beginPath();
        ctx.ellipse(0, 0, eyeRadius, eyeRadius * 0.7, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(80,0,0,0.9)";
        ctx.lineWidth = 3 * scale;
        ctx.stroke();

        // Eyelashes / spiky surround
        ctx.strokeStyle = `rgba(60,0,0,${0.8 * scale})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 14; i++) {
          const t = (i / 14) * Math.PI * 2;
          const rx = eyeRadius;
          const ry = eyeRadius * 0.7;
          const x1 = Math.cos(t) * rx;
          const y1 = Math.sin(t) * ry;
          const x2 =
            Math.cos(t) * (rx + 14 + Math.sin(t * 3 + now * 0.002) * 6);
          const y2 =
            Math.sin(t) * (ry + 14 + Math.sin(t * 3 + now * 0.002) * 6);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        ctx.restore(); // restore from translate
      }
    }

    // Draw ground
    ctx.fillStyle = "#3d7a1f";
    ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);
    ctx.fillStyle = "#5aaa2e";
    ctx.fillRect(0, CANVAS_HEIGHT - 22, CANVAS_WIDTH, 3);

    // ---- Draw 2D player character (dark-skinned) ----
    const px = PLAYER_X;
    const py = s.playerY;
    const r = PLAYER_SIZE / 2;
    const velocity = s.playerVelocity;
    const isFlapping = flapFlashRef.current > 0;

    // Tilt angle based on velocity
    const tiltAngle = Math.max(-0.5, Math.min(0.8, velocity * 0.06));

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(tiltAngle);

    // Body (rounded rectangle, dark skin tone)
    const bodyW = PLAYER_SIZE * 0.85;
    const bodyH = PLAYER_SIZE * 1.1;
    const bodyX = -bodyW / 2;
    const bodyY = -bodyH / 2;
    const bodyRadius = bodyW * 0.35;

    ctx.beginPath();
    ctx.moveTo(bodyX + bodyRadius, bodyY);
    ctx.lineTo(bodyX + bodyW - bodyRadius, bodyY);
    ctx.quadraticCurveTo(
      bodyX + bodyW,
      bodyY,
      bodyX + bodyW,
      bodyY + bodyRadius,
    );
    ctx.lineTo(bodyX + bodyW, bodyY + bodyH - bodyRadius);
    ctx.quadraticCurveTo(
      bodyX + bodyW,
      bodyY + bodyH,
      bodyX + bodyW - bodyRadius,
      bodyY + bodyH,
    );
    ctx.lineTo(bodyX + bodyRadius, bodyY + bodyH);
    ctx.quadraticCurveTo(
      bodyX,
      bodyY + bodyH,
      bodyX,
      bodyY + bodyH - bodyRadius,
    );
    ctx.lineTo(bodyX, bodyY + bodyRadius);
    ctx.quadraticCurveTo(bodyX, bodyY, bodyX + bodyRadius, bodyY);
    ctx.closePath();
    ctx.fillStyle = SKIN_MID;
    ctx.fill();
    ctx.strokeStyle = SKIN_SHADOW;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Head (circle, dark skin tone)
    const headR = r * 0.72;
    const headY = bodyY - headR * 0.6;
    ctx.beginPath();
    ctx.arc(0, headY, headR, 0, Math.PI * 2);
    ctx.fillStyle = SKIN_DARK;
    ctx.fill();
    ctx.strokeStyle = SKIN_SHADOW;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Eyes (bright white sclera for contrast)
    const eyeOffsetX = headR * 0.35;
    const eyeOffsetY = headY - headR * 0.1;
    // White of eye
    ctx.beginPath();
    ctx.arc(eyeOffsetX, eyeOffsetY, headR * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = "#f0ece4";
    ctx.fill();
    // Iris/pupil
    ctx.beginPath();
    ctx.arc(eyeOffsetX, eyeOffsetY, headR * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = "#1a0a05";
    ctx.fill();

    // Eye shine
    ctx.beginPath();
    ctx.arc(
      eyeOffsetX + headR * 0.06,
      eyeOffsetY - headR * 0.06,
      headR * 0.06,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Smile / expression
    ctx.beginPath();
    ctx.arc(headR * 0.1, headY + headR * 0.3, headR * 0.25, 0.1, Math.PI - 0.1);
    ctx.strokeStyle = SKIN_SHADOW;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Teeth (small white arc inside smile)
    ctx.beginPath();
    ctx.arc(headR * 0.1, headY + headR * 0.3, headR * 0.18, 0.2, Math.PI - 0.2);
    ctx.fillStyle = "#f5f0e8";
    ctx.fill();

    // Hair (tight coils / afro shape on top of head)
    ctx.beginPath();
    ctx.arc(
      0,
      headY - headR * 0.25,
      headR * 0.72,
      Math.PI + 0.1,
      Math.PI * 2 - 0.1,
    );
    ctx.fillStyle = HAIR_COLOR;
    ctx.fill();

    // Extra hair volume bumps for afro texture
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.arc(
        i * headR * 0.28,
        headY - headR * 0.82,
        headR * 0.28,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = HAIR_COLOR;
      ctx.fill();
    }

    // Arms — animate on flap, dark skin tone
    const armAngle = isFlapping ? -0.9 : 0.4;
    const armLen = r * 0.9;
    const armW = r * 0.28;

    // Left arm
    ctx.save();
    ctx.translate(-bodyW / 2 + armW * 0.3, bodyY + bodyH * 0.25);
    ctx.rotate(-armAngle);
    ctx.beginPath();
    ctx.roundRect(-armW / 2, 0, armW, armLen, armW / 2);
    ctx.fillStyle = SKIN_MID;
    ctx.fill();
    ctx.strokeStyle = SKIN_SHADOW;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Right arm
    ctx.save();
    ctx.translate(bodyW / 2 - armW * 0.3, bodyY + bodyH * 0.25);
    ctx.rotate(armAngle);
    ctx.beginPath();
    ctx.roundRect(-armW / 2, 0, armW, armLen, armW / 2);
    ctx.fillStyle = SKIN_MID;
    ctx.fill();
    ctx.strokeStyle = SKIN_SHADOW;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Shirt / torso color overlay — bright street-art yellow with graphic stripe
    ctx.beginPath();
    ctx.moveTo(bodyX + bodyRadius, bodyY + bodyH * 0.3);
    ctx.lineTo(bodyX + bodyW - bodyRadius, bodyY + bodyH * 0.3);
    ctx.lineTo(bodyX + bodyW, bodyY + bodyH * 0.35);
    ctx.lineTo(bodyX + bodyW, bodyY + bodyH - bodyRadius);
    ctx.quadraticCurveTo(
      bodyX + bodyW,
      bodyY + bodyH,
      bodyX + bodyW - bodyRadius,
      bodyY + bodyH,
    );
    ctx.lineTo(bodyX + bodyRadius, bodyY + bodyH);
    ctx.quadraticCurveTo(
      bodyX,
      bodyY + bodyH,
      bodyX,
      bodyY + bodyH - bodyRadius,
    );
    ctx.lineTo(bodyX, bodyY + bodyH * 0.35);
    ctx.closePath();
    ctx.fillStyle = "#F5C518"; // bold street-art yellow
    ctx.fill();

    // Shirt stripe accent
    ctx.fillStyle = "#E03A1E"; // red stripe
    ctx.fillRect(
      bodyX + bodyW * 0.35,
      bodyY + bodyH * 0.3,
      bodyW * 0.12,
      bodyH * 0.7,
    );

    ctx.restore();
  }, [
    stateRef,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PLAYER_X,
    PLAYER_SIZE,
    OBSTACLE_WIDTH,
    LASER_HEIGHT,
    isLevel21Active,
  ]);

  // Game loop — also tick down the flapFlashRef timer
  useEffect(() => {
    lastTimeRef.current = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;
      if (flapFlashRef.current > 0) {
        flapFlashRef.current = Math.max(0, flapFlashRef.current - dt);
      }
      tick(dt);
      draw();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [tick, draw]);

  // Input handling — set flapFlashRef on flap
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        flapFlashRef.current = 0.5;
        flap();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flap]);

  const handleCanvasClick = useCallback(() => {
    flapFlashRef.current = 0.5;
    flap();
  }, [flap]);

  return (
    <div
      className="relative flex items-center justify-center w-full h-full"
      style={{ background: "#0a0414" }}
    >
      <div
        className="relative"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        {/* 2D canvas for background, pipes, and player character */}
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block absolute inset-0"
          style={{ imageRendering: "pixelated", zIndex: 1 }}
          onClick={handleCanvasClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleCanvasClick();
          }}
          tabIndex={0}
        />

        {/* UI overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 3 }}
        >
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
            isScore20EasterEggActive={isScore20EasterEggActive}
            isLevel21Active={isLevel21Active}
          />
        </div>
      </div>
    </div>
  );
}
