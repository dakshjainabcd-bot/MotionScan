import { useEffect, useRef } from 'react';

const CONNECTIONS = [
  [11, 12], [11, 23], [12, 24], [23, 24],
  [11, 13], [13, 15],
  [12, 14], [14, 16],
  [23, 25], [25, 27], [27, 29], [27, 31],
  [24, 26], [26, 28], [28, 30], [28, 32],
];

export default function SkeletonOverlay({ landmarks, width, height, quality = 'ok' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    if (!landmarks) return;

    const strokeColor = quality === 'good' ? '#0f9d58' : quality === 'warn' ? '#b8860b' : '#6d28d9';

    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeColor;
    ctx.lineCap = 'round';

    CONNECTIONS.forEach(([a, b]) => {
      const p1 = landmarks[a];
      const p2 = landmarks[b];
      if (!p1 || !p2) return;
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.stroke();
    });

    landmarks.forEach((p) => {
      if (!p || (p.visibility ?? 1) < 0.5) return;
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, 4, 0, 2 * Math.PI);
      ctx.fillStyle = strokeColor;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, 4, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }, [landmarks, width, height, quality]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
    />
  );
}