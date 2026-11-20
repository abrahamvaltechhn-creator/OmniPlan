import React, { useEffect, useRef } from 'react';
import { registerConfettiCanvas } from '../utils/confetti';

export const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    registerConfettiCanvas(canvas);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      registerConfettiCanvas(null);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
};
