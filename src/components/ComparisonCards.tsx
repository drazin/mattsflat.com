import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BubbleBackground from './BubbleBackground';

gsap.registerPlugin(ScrollTrigger);

const regularItems = [
  { emoji: '🔥', text: 'Burns your throat' },
  { emoji: '💣', text: 'Explodes when shaken' },
  { emoji: '👊', text: 'Assaults your taste buds' },
  { emoji: '🤬', text: 'Will fight you' },
];

const flatItems = [
  { emoji: '🧈', text: 'Smooth and flavorful' },
  { emoji: '😌', text: 'Shake it all you want' },
  { emoji: '👅', text: 'Actually lets you taste things' },
  { emoji: '🧊', text: 'Aggressively chill' },
];

export default function ComparisonCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const regularRef = useRef<HTMLDivElement>(null);
  const flatRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Stagger in the regular soda items
    gsap.from('.regular-item', {
      x: -30,
      opacity: 0,
      duration: 0.4,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
      },
    });

    // Stagger in the flat items
    gsap.from('.flat-item', {
      x: 30,
      opacity: 0,
      duration: 0.4,
      stagger: 0.15,
      delay: 0.3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
      },
    });

    // VS badge pop
    gsap.from('.vs-badge', {
      scale: 0,
      rotation: -180,
      duration: 0.6,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 max-w-4xl mx-auto items-stretch">
      {/* Regular Soda - the aggressive one */}
      <div
        ref={regularRef}
        className="relative overflow-hidden rounded-3xl p-8 md:p-10 border-2 border-red-200 animate-[shake_0.5s_ease-in-out_infinite]"
        style={{ background: 'linear-gradient(135deg, #FEE2E2, #FECACA)' }}
      >
        <BubbleBackground count={40} speed="fast" color="rgb(239, 68, 68)" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🥤</span>
            <h3 className="font-[var(--font-display)] font-black text-2xl md:text-3xl text-red-500">
              Regular Soda
            </h3>
          </div>
          <ul className="space-y-4">
            {regularItems.map((item, i) => (
              <li key={i} className="regular-item flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <span className="text-charcoal/80 font-medium text-lg">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* VS Badge */}
      <div className="hidden md:flex items-center justify-center">
        <div className="vs-badge w-16 h-16 rounded-full bg-charcoal text-white font-[var(--font-display)] font-black text-xl flex items-center justify-center shadow-lg">
          VS
        </div>
      </div>
      <div className="flex md:hidden items-center justify-center py-2">
        <div className="vs-badge w-12 h-12 rounded-full bg-charcoal text-white font-[var(--font-display)] font-black text-base flex items-center justify-center shadow-lg">
          VS
        </div>
      </div>

      {/* Matt's Flat - the chill one */}
      <div
        ref={flatRef}
        className="relative overflow-hidden rounded-3xl p-8 md:p-10 border-2 border-green-200"
        style={{ background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)' }}
      >
        <BubbleBackground count={5} speed="slow" color="rgb(34, 197, 94)" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">😎</span>
            <h3 className="font-[var(--font-display)] font-black text-2xl md:text-3xl text-green-600">
              Matt's Flat
            </h3>
          </div>
          <ul className="space-y-4">
            {flatItems.map((item, i) => (
              <li key={i} className="flat-item flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <span className="text-charcoal/80 font-medium text-lg">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
