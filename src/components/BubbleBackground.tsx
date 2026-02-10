import { useRef, useEffect, useState } from 'react';

interface Props {
  count: number;
  speed: 'fast' | 'slow';
  color: string;
}

interface Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  opacity: number;
  phase: number;
}

export default function BubbleBackground({ count, speed, color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animRef = useRef<number>(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure parent layout is computed
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getSize = () => {
      const rect = container.getBoundingClientRect();
      return { w: rect.width, h: rect.height };
    };

    const setupCanvas = () => {
      const { w, h } = getSize();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    const { w, h } = setupCanvas();

    if (w === 0 || h === 0) return;

    const baseSpeed = speed === 'fast' ? 1.5 : 0.4;

    bubblesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h + h * 0.5,
      size: speed === 'fast' ? 3 + Math.random() * 8 : 4 + Math.random() * 10,
      speed: baseSpeed + Math.random() * baseSpeed,
      wobbleSpeed: 0.5 + Math.random() * 1.5,
      wobbleAmount: speed === 'fast' ? 1 + Math.random() * 3 : 0.5 + Math.random() * 1.5,
      opacity: 0.2 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    // Parse color once
    const colorMatch = color.match(/\d+/g);
    const r = colorMatch?.[0] ?? '0';
    const g = colorMatch?.[1] ?? '0';
    const b = colorMatch?.[2] ?? '0';

    let time = 0;

    const animate = () => {
      const { w: cw, h: ch } = getSize();
      if (cw === 0 || ch === 0) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, cw, ch);
      time += 0.016;

      for (const bubble of bubblesRef.current) {
        bubble.y -= bubble.speed;
        const wobble = Math.sin(time * bubble.wobbleSpeed + bubble.phase) * bubble.wobbleAmount;

        if (bubble.y + bubble.size < 0) {
          bubble.y = ch + bubble.size + Math.random() * 20;
          bubble.x = Math.random() * cw;
        }

        ctx.beginPath();
        ctx.arc(bubble.x + wobble, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${bubble.opacity})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    const observer = new ResizeObserver(() => setupCanvas());
    observer.observe(container);

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, [ready, count, speed, color]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
}
