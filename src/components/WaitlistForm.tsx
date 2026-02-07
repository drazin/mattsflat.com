import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const successRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (status === 'success' && successRef.current) {
      gsap.from(successRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
      });
    }
  }, { dependencies: [status] });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
      setStatus(data.success ? 'success' : 'error');
    } catch {
      setStatus('error');
      setMessage("Something went wrong. Even Matt's drink is smoother than this.");
    }
  };

  if (status === 'success') {
    return (
      <div ref={successRef} className="text-center space-y-4">
        <div className="text-5xl">&#127881;</div>
        <p className="font-[var(--font-display)] font-bold text-2xl text-charcoal">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-6 py-4 rounded-full border-2 border-charcoal/10 bg-white
                   text-charcoal placeholder:text-charcoal/30
                   focus:outline-none focus:border-coral transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-coral text-white font-[var(--font-display)] font-bold px-8 py-4 rounded-full
                   hover:bg-coral/90 transition-all duration-300 text-lg
                   whitespace-nowrap disabled:opacity-50 cursor-pointer"
      >
        {status === 'loading' ? 'Joining...' : "I'm In"}
      </button>

      {status === 'error' && (
        <p className="text-red-500 text-sm text-center sm:text-left mt-2">{message}</p>
      )}
    </form>
  );
}
