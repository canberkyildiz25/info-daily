import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 – Page Not Found',
  description: 'This page does not exist.',
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-[#050d1c] text-white px-6">
      {/* Stars */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: s.size,
              height: s.size,
              top: s.top,
              left: s.left,
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Floating astronaut */}
      <div
        aria-hidden
        className="relative mb-10 select-none"
        style={{ animation: 'float 6s ease-in-out infinite' }}
      >
        <svg
          width="120"
          height="140"
          viewBox="0 0 120 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Backpack */}
          <rect x="42" y="62" width="14" height="20" rx="3" fill="#b0bec5" />
          {/* Body */}
          <rect x="30" y="58" width="40" height="44" rx="14" fill="#eceff1" />
          {/* Helmet */}
          <circle cx="50" cy="42" r="24" fill="#cfd8dc" />
          {/* Visor */}
          <ellipse cx="50" cy="42" rx="15" ry="13" fill="#1a237e" opacity="0.85" />
          {/* Visor shine */}
          <ellipse cx="44" cy="37" rx="5" ry="4" fill="white" opacity="0.18" />
          {/* Left arm */}
          <rect
            x="10"
            y="62"
            width="22"
            height="11"
            rx="5"
            fill="#eceff1"
            style={{ transformOrigin: '32px 67px', animation: 'waveArm 3s ease-in-out infinite' }}
          />
          {/* Right arm */}
          <rect x="68" y="62" width="22" height="11" rx="5" fill="#eceff1" />
          {/* Left leg */}
          <rect x="34" y="98" width="14" height="26" rx="6" fill="#eceff1" />
          {/* Right leg */}
          <rect x="52" y="98" width="14" height="26" rx="6" fill="#eceff1" />
          {/* Boots */}
          <rect x="30" y="118" width="18" height="10" rx="5" fill="#90a4ae" />
          <rect x="52" y="118" width="18" height="10" rx="5" fill="#90a4ae" />
          {/* Oxygen tube */}
          <path d="M70 78 Q90 70 86 56 Q82 44 70 42" stroke="#80cbc4" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Oxygen tank */}
          <rect x="84" y="34" width="12" height="20" rx="5" fill="#80cbc4" />
        </svg>
      </div>

      {/* 404 */}
      <h1
        className="text-[96px] font-extrabold leading-none tracking-tight mb-2"
        style={{
          background: 'linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        404
      </h1>

      <p className="text-xl font-semibold text-slate-200 mb-3">Lost in space</p>
      <p className="text-slate-400 text-center max-w-xs mb-10 leading-relaxed">
        The page you&apos;re looking for drifted off into the void. Don&apos;t worry — mission control is still here.
      </p>

      <Link
        href="/"
        className="px-7 py-3 rounded-full font-semibold text-sm transition-transform hover:scale-105 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#fff' }}
      >
        Back to Home
      </Link>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-22px) rotate(3deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: var(--tw-opacity, 0.6); transform: scale(1); }
          50%       { opacity: 0.1; transform: scale(0.6); }
        }
        @keyframes waveArm {
          0%, 100% { transform: rotate(0deg); }
          50%       { transform: rotate(-30deg); }
        }
      `}</style>
    </div>
  );
}

const STARS = [
  { size: '2px',  top: '8%',  left: '12%', opacity: 0.7, duration: 2.8, delay: 0.0 },
  { size: '1px',  top: '15%', left: '30%', opacity: 0.5, duration: 3.5, delay: 0.4 },
  { size: '3px',  top: '5%',  left: '55%', opacity: 0.8, duration: 2.1, delay: 0.8 },
  { size: '1px',  top: '20%', left: '75%', opacity: 0.6, duration: 4.0, delay: 1.2 },
  { size: '2px',  top: '35%', left: '88%', opacity: 0.7, duration: 3.2, delay: 0.2 },
  { size: '1px',  top: '50%', left: '95%', opacity: 0.4, duration: 2.6, delay: 1.6 },
  { size: '2px',  top: '65%', left: '80%', opacity: 0.6, duration: 3.8, delay: 0.6 },
  { size: '3px',  top: '75%', left: '60%', opacity: 0.9, duration: 2.4, delay: 1.0 },
  { size: '1px',  top: '85%', left: '40%', opacity: 0.5, duration: 3.1, delay: 0.3 },
  { size: '2px',  top: '90%', left: '20%', opacity: 0.7, duration: 2.9, delay: 1.4 },
  { size: '1px',  top: '45%', left: '5%',  opacity: 0.4, duration: 4.2, delay: 0.7 },
  { size: '2px',  top: '25%', left: '48%', opacity: 0.6, duration: 3.3, delay: 1.8 },
  { size: '1px',  top: '70%', left: '15%', opacity: 0.5, duration: 2.7, delay: 0.5 },
  { size: '3px',  top: '12%', left: '92%', opacity: 0.8, duration: 3.6, delay: 1.1 },
  { size: '1px',  top: '55%', left: '70%', opacity: 0.4, duration: 4.5, delay: 2.0 },
  { size: '2px',  top: '40%', left: '35%', opacity: 0.6, duration: 2.3, delay: 0.9 },
  { size: '1px',  top: '80%', left: '85%', opacity: 0.5, duration: 3.9, delay: 1.3 },
  { size: '2px',  top: '60%', left: '50%', opacity: 0.7, duration: 2.5, delay: 1.7 },
  { size: '1px',  top: '30%', left: '22%', opacity: 0.4, duration: 4.1, delay: 0.1 },
  { size: '3px',  top: '95%', left: '65%', opacity: 0.9, duration: 2.2, delay: 1.5 },
];
