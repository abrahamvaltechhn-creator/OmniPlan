// 2D Canvas Confetti Engine with physics, rotation, and gravity

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  alpha: number;
  decay: number;
}

let activeCanvas: HTMLCanvasElement | null = null;
let animationId: number | null = null;
const particles: Particle[] = [];

const COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
];

export function registerConfettiCanvas(canvas: HTMLCanvasElement | null) {
  activeCanvas = canvas;
}

export function triggerConfetti(originX?: number, originY?: number) {
  if (!activeCanvas) return;

  const width = activeCanvas.width;
  const height = activeCanvas.height;

  const startX = originX ?? width / 2;
  const startY = originY ?? height * 0.45;

  const particleCount = 70;
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5);
    const speed = 4 + Math.random() * 8;
    particles.push({
      x: startX,
      y: startY,
      w: 8 + Math.random() * 6,
      h: 5 + Math.random() * 5,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3.5, // initial upward lift
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      decay: 0.012 + Math.random() * 0.01,
    });
  }

  if (!animationId) {
    loop();
  }
}

function loop() {
  if (!activeCanvas) return;
  const ctx = activeCanvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.22; // gravity
    p.vx *= 0.98; // air resistance
    p.rotation += p.rotSpeed;
    p.alpha -= p.decay;

    if (p.alpha <= 0 || p.y > activeCanvas.height + 20) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }

  if (particles.length > 0) {
    animationId = requestAnimationFrame(loop);
  } else {
    animationId = null;
    ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
  }
}
