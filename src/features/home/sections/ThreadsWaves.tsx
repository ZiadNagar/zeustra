import type { ReactElement } from "react";
import { useEffect, useRef } from "react";

const SCROLL_IDLE_MS = 160;

type ThreadWaveCanvasProps = {
  reducedEffects?: boolean;
  isActive?: boolean;
};

type DrawFlowOptions = {
  colorGradient: CanvasGradient;
  flowSpeed: number;
  envelopeSpeed: number;
  flowPhase: number;
  spreadScale: number;
  ampScale: number;
  lineScale: number;
  alphaBase: number;
  alphaBoost: number;
  verticalOffset: number;
  lineStride: number;
  envelopeBuffer: Float32Array;
  flowLineCount: number;
  glowStrength: number;
  bloomLineStride: number;
  coreOnly: boolean;
  uniformLineWidth: boolean;
  fixedLineWidth: number;
  uniformAlpha: boolean;
  fixedAlpha: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function isLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency || 8;
  return cores <= 4;
}

export default function ThreadWaveCanvas({
  reducedEffects = false,
  isActive = true,
}: ThreadWaveCanvasProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const userScrollingRef = useRef<boolean>(false);
  const scrollIdleTimerRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return undefined;

    let rafId = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    const baseSceneWidth = 1440;
    const baseSceneHeight = 860;
    let sceneWidth = baseSceneWidth;
    let sceneHeight = baseSceneHeight;
    let sceneScale = 1;
    let sceneOffsetX = 0;
    let sceneOffsetY = 0;

    const lowPower = isLowPowerDevice();
    let lastFrameMs = 0;
    let isVisible = true;
    let phase = 0;
    let envelopePhase = 0;
    let smoothedDeltaMs = 16.67;
    let qualityScale = lowPower ? 0.88 : 0.94;
    if (reducedEffects) {
      qualityScale = Math.min(qualityScale, 0.8);
    }

    let gradientFront: CanvasGradient = ctx.createLinearGradient(0, 0, 1, 0);
    let gradientBack: CanvasGradient = ctx.createLinearGradient(0, 0, 1, 0);
    let neonWash: CanvasGradient = ctx.createLinearGradient(0, 0, 1, 0);
    let vignette: CanvasGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    let xPositions: number[] = [];
    let waveA: number[] = [];
    let waveB: number[] = [];
    let waveC: number[] = [];
    let envelopeFront: Float32Array = new Float32Array(0);
    let envelopeBack: Float32Array = new Float32Array(0);
    let lineYBuffer: Float32Array = new Float32Array(0);
    let lineWidthScale = 1;
    let resizeRafId = 0;

    let lineCount = lowPower ? 22 : 32;
    let xStep = lowPower ? 11 : 9;

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const startLoop = () => {
      if (rafId || !isVisible || !isActive || userScrollingRef.current) return;
      rafId = requestAnimationFrame(draw);
    };

    const markUserScrolling = () => {
      userScrollingRef.current = true;
      if (scrollIdleTimerRef.current) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }
      scrollIdleTimerRef.current = window.setTimeout(() => {
        scrollIdleTimerRef.current = 0;
        userScrollingRef.current = false;
        lastFrameMs = 0;
        startLoop();
      }, SCROLL_IDLE_MS);
      stopLoop();
    };

    const refreshGeometryCache = () => {
      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;

      let baseLineCount: number;
      let baseXStep: number;

      if (lowPower) {
        if (isMobile) {
          baseLineCount = 18;
          baseXStep = 5;
          lineWidthScale = 0.9;
        } else if (isTablet) {
          baseLineCount = 22;
          baseXStep = 7;
          lineWidthScale = 0.95;
        } else {
          baseLineCount = width > 1200 ? 26 : 24;
          baseXStep = width > 1200 ? 9 : 8;
          lineWidthScale = 1;
        }
      } else if (isMobile) {
        baseLineCount = 24;
        baseXStep = 4;
        lineWidthScale = 0.92;
      } else if (isTablet) {
        baseLineCount = 30;
        baseXStep = 6;
        lineWidthScale = 0.96;
      } else {
        baseLineCount = width > 1300 ? 36 : 32;
        baseXStep = width > 1300 ? 7 : 8;
        lineWidthScale = 1;
      }

      lineCount = clamp(Math.round(baseLineCount * qualityScale), 14, 44);
      xStep = clamp(
        Math.round(baseXStep / qualityScale),
        isMobile ? 3 : 4,
        12,
      );

      xPositions = [];
      waveA = [];
      waveB = [];
      waveC = [];

      for (let x = 0; x <= sceneWidth; x += xStep) {
        const nx = x / sceneWidth;
        xPositions.push(x);
        waveA.push(nx * Math.PI * 2.25);
        waveB.push(nx * Math.PI * 2.7);
        waveC.push(nx * Math.PI * 6.6);
      }
      envelopeFront = new Float32Array(xPositions.length);
      envelopeBack = new Float32Array(xPositions.length);
      lineYBuffer = new Float32Array(xPositions.length);

      gradientFront = ctx.createLinearGradient(0, 0, sceneWidth, 0);
      gradientFront.addColorStop(0.0, "rgba(0, 240, 255, 1)");
      gradientFront.addColorStop(0.42, "rgba(58, 90, 255, 1)");
      gradientFront.addColorStop(0.7, "rgba(180, 70, 255, 1)");
      gradientFront.addColorStop(1.0, "rgba(255, 74, 232, 1)");

      gradientBack = ctx.createLinearGradient(0, 0, sceneWidth, 0);
      gradientBack.addColorStop(0.0, "rgba(0, 210, 255, 0.78)");
      gradientBack.addColorStop(0.45, "rgba(70, 86, 255, 0.78)");
      gradientBack.addColorStop(1.0, "rgba(222, 70, 255, 0.78)");

      neonWash = ctx.createLinearGradient(0, 0, sceneWidth, 0);
      neonWash.addColorStop(0, "rgba(0, 220, 255, 0.08)");
      neonWash.addColorStop(0.5, "rgba(120, 96, 255, 0.06)");
      neonWash.addColorStop(1, "rgba(255, 92, 235, 0.08)");

      vignette = ctx.createRadialGradient(
        sceneWidth * 0.5,
        sceneHeight * 0.5,
        sceneHeight * 0.08,
        sceneWidth * 0.5,
        sceneHeight * 0.5,
        sceneHeight * 0.75,
      );
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.5)");
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      const isMobileViewport = width < 768;
      const maxDpr =
        isMobileViewport ?
          lowPower ? 1.25
          : 1.5
        : lowPower ? 1.1
        : 1.22;
      dpr = clamp(window.devicePixelRatio || 1, 1, maxDpr);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sceneWidth = baseSceneWidth;
      sceneHeight = baseSceneHeight;
      sceneScale = Math.max(width / sceneWidth, height / sceneHeight);
      sceneOffsetX = (width - sceneWidth * sceneScale) * 0.5;
      sceneOffsetY = (height - sceneHeight * sceneScale) * 0.5;

      refreshGeometryCache();
      lastFrameMs = 0;
    };

    const scheduleResize = () => {
      if (resizeRafId) {
        cancelAnimationFrame(resizeRafId);
      }
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = 0;
        resize();
      });
    };

    const draw = (timeMs: number) => {
      rafId = 0;

      if (!isVisible || !isActive) {
        return;
      }

      if (userScrollingRef.current) {
        return;
      }

      if (lastFrameMs === 0) {
        lastFrameMs = timeMs;
      }

      const elapsed = timeMs - lastFrameMs;
      lastFrameMs = timeMs;

      // Smooth dt; cap max step so tab-switch pauses don't jump the wave.
      const clampedDeltaMs = clamp(elapsed, 8, 32);
      smoothedDeltaMs += (clampedDeltaMs - smoothedDeltaMs) * 0.15;
      phase += smoothedDeltaMs * 0.00135;
      envelopePhase += smoothedDeltaMs * 0.00066;

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      ctx.translate(sceneOffsetX, sceneOffsetY);
      ctx.scale(sceneScale, sceneScale);

      const drawFlow = ({
        colorGradient,
        flowSpeed,
        envelopeSpeed,
        flowPhase,
        spreadScale,
        ampScale,
        lineScale,
        alphaBase,
        alphaBoost,
        verticalOffset,
        lineStride,
        envelopeBuffer,
        flowLineCount,
        glowStrength,
        bloomLineStride,
        coreOnly,
        uniformLineWidth,
        fixedLineWidth,
        uniformAlpha,
        fixedAlpha,
      }: DrawFlowOptions) => {
        const centerY = sceneHeight * (0.5 + verticalOffset);
        const spread = sceneHeight * 0.34 * spreadScale;
        const mainWaveAmp = sceneHeight * 0.12 * ampScale;

        const envelopeTimeShift = envelopePhase * envelopeSpeed;
        const baseWaveTimeShift = phase * flowSpeed;
        const secondaryWaveTimeShift = phase * (flowSpeed * 0.72);

        for (let p = 0; p < xPositions.length; p += 1) {
          const envelopeSin = Math.abs(Math.sin(waveA[p] - envelopeTimeShift));
          envelopeBuffer[p] = 0.1 + 0.9 * envelopeSin * envelopeSin;
        }

        const drawPass = (
          alphaMul: number,
          lineMul: number,
          strideMul: number,
        ) => {
          ctx.globalCompositeOperation = "lighter";
          ctx.strokeStyle = colorGradient;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.shadowBlur = 0;

          const passStride = Math.max(1, Math.floor(lineStride * strideMul));
          for (let i = 0; i < flowLineCount; i += passStride) {
            const normalized = i / (flowLineCount - 1);
            const threadOffset = normalized - 0.5;
            const phaseShift = threadOffset * 3.0 + flowPhase;

            ctx.beginPath();
            ctx.lineWidth =
              uniformLineWidth ? fixedLineWidth * lineWidthScale : (
                lineScale *
                lineWidthScale *
                lineMul *
                (1 + (1 - Math.abs(threadOffset) * 0.82) * 0.45)
              );
            ctx.globalAlpha =
              uniformAlpha ?
                fixedAlpha * alphaMul
              : (alphaBase + (1 - Math.abs(threadOffset) * 0.86) * alphaBoost) *
                alphaMul;

            for (let p = 0; p < xPositions.length; p += 1) {
              const envelope = envelopeBuffer[p];
              const baseWave = Math.sin(
                waveB[p] - baseWaveTimeShift + phaseShift,
              );
              const secondaryWave = Math.sin(
                waveC[p] - secondaryWaveTimeShift + i * 0.1,
              );

              const y =
                centerY +
                baseWave * mainWaveAmp * envelope +
                threadOffset * spread * envelope +
                secondaryWave * 2.0;

              lineYBuffer[p] = y;
            }

            if (xPositions.length > 2) {
              ctx.moveTo(xPositions[0], lineYBuffer[0]);
              for (let p = 1; p < xPositions.length - 1; p += 1) {
                const midX = (xPositions[p] + xPositions[p + 1]) * 0.5;
                const midY = (lineYBuffer[p] + lineYBuffer[p + 1]) * 0.5;
                ctx.quadraticCurveTo(xPositions[p], lineYBuffer[p], midX, midY);
              }
              const lastIndex = xPositions.length - 1;
              ctx.quadraticCurveTo(
                xPositions[lastIndex - 1],
                lineYBuffer[lastIndex - 1],
                xPositions[lastIndex],
                lineYBuffer[lastIndex],
              );
            } else {
              for (let p = 0; p < xPositions.length; p += 1) {
                const y = lineYBuffer[p];
                if (p === 0) {
                  ctx.moveTo(xPositions[p], y);
                } else {
                  ctx.lineTo(xPositions[p], y);
                }
              }
            }
            ctx.stroke();
          }
        };

        if (!coreOnly) {
          drawPass(glowStrength * 0.42, lowPower ? 1.75 : 2.05, bloomLineStride);
        }
        drawPass(1, 1, 1);
      };

      const backLineCount = Math.max(12, Math.floor(lineCount * 0.58));
      const frontLineCount = Math.max(backLineCount + 8, lineCount);

      drawFlow({
        colorGradient: gradientBack,
        flowSpeed: 1.2,
        envelopeSpeed: 0.62,
        flowPhase: Math.PI * 0.38,
        spreadScale: 0.92,
        ampScale: 0.9,
        lineScale: 0.92,
        alphaBase: 0.2,
        alphaBoost: 0.34,
        verticalOffset: -0.018,
        lineStride: 1,
        envelopeBuffer: envelopeBack,
        flowLineCount: backLineCount,
        glowStrength: 1.35,
        bloomLineStride: 1,
        coreOnly: true,
        uniformLineWidth: false,
        fixedLineWidth: 1,
        uniformAlpha: false,
        fixedAlpha: 1,
      });

      drawFlow({
        colorGradient: gradientFront,
        flowSpeed: 1.45,
        envelopeSpeed: 0.74,
        flowPhase: 0,
        spreadScale: 1,
        ampScale: 1,
        lineScale: 1,
        alphaBase: 0.34,
        alphaBoost: 0.42,
        verticalOffset: 0.014,
        lineStride: 1,
        envelopeBuffer: envelopeFront,
        flowLineCount: frontLineCount,
        glowStrength: 1.5,
        bloomLineStride: 2,
        coreOnly: false,
        uniformLineWidth: true,
        fixedLineWidth: 1.4,
        uniformAlpha: true,
        fixedAlpha: 0.68,
      });

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = neonWash;
      ctx.fillRect(0, 0, sceneWidth, sceneHeight);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, sceneWidth, sceneHeight);
      ctx.restore();

      rafId = requestAnimationFrame(draw);
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastFrameMs = 0;
        startLoop();
      } else {
        stopLoop();
      }
    };

    const onScrollInteraction = () => {
      markUserScrolling();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", scheduleResize, { passive: true });
    window.addEventListener("orientationchange", scheduleResize);
    window.addEventListener("wheel", onScrollInteraction, { passive: true });
    window.addEventListener("scroll", onScrollInteraction, { passive: true });
    window.addEventListener("touchmove", onScrollInteraction, { passive: true });

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startLoop();

    return () => {
      stopLoop();
      if (scrollIdleTimerRef.current) {
        window.clearTimeout(scrollIdleTimerRef.current);
        scrollIdleTimerRef.current = 0;
      }
      if (resizeRafId) {
        cancelAnimationFrame(resizeRafId);
      }
      ro.disconnect();
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("orientationchange", scheduleResize);
      window.removeEventListener("wheel", onScrollInteraction);
      window.removeEventListener("scroll", onScrollInteraction);
      window.removeEventListener("touchmove", onScrollInteraction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [reducedEffects, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full thread-wave-canvas"
    />
  );
}
