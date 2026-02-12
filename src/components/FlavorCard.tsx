import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Flavor } from '../data/flavors';

interface Props {
  flavor: Flavor;
}

export default function FlavorCard({ flavor }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;

    const handleEnter = () => {
      gsap.to(card, { y: -8, scale: 1.02, duration: 0.3, ease: 'power2.out' });
    };

    const handleLeave = () => {
      gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    card.addEventListener('mouseenter', handleEnter);
    card.addEventListener('mouseleave', handleLeave);

    return () => {
      card.removeEventListener('mouseenter', handleEnter);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className={`rounded-3xl overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-xl flex flex-col ${
        flavor.isHero ? 'md:col-span-2 md:row-span-2' : ''
      }`}
      style={{ backgroundColor: flavor.color }}
    >
      <div className={`w-full overflow-hidden ${flavor.isHero ? 'flex-1 min-h-0' : 'aspect-[4/3]'}`}>
        {flavor.id === 'original-flat' ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-top"
            poster={`/images/flavors/${flavor.id}.png`}
          >
            <source src={`/images/flavors/${flavor.id}.mp4`} type="video/mp4" />
          </video>
        ) : (
          <img
            src={`/images/flavors/${flavor.id}.png`}
            alt={`${flavor.name} can`}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        )}
      </div>

      <div className="p-6 space-y-2">
        <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">
          {flavor.profile}
        </span>
        <h3 className="font-[var(--font-display)] font-extrabold text-2xl text-charcoal">
          {flavor.name}
        </h3>
        <p className="text-charcoal/60 italic">
          &ldquo;{flavor.tagline}&rdquo;
        </p>
        <p className="text-sm text-charcoal/50 leading-relaxed">
          {flavor.description}
        </p>
      </div>
    </div>
  );
}
