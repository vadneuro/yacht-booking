'use client';

export default function OceanWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none z-[1]">
      <svg
        className="absolute bottom-0 w-[200%] h-full animate-wave-slow"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,60 1440,60 L1440,120 L0,120 Z"
          fill="oklch(97.5% 0.006 244 / 0.6)"
        />
      </svg>
      <svg
        className="absolute bottom-0 w-[200%] h-full animate-wave-mid"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 C240,40 480,100 720,60 C960,20 1200,80 1440,60 L1440,120 L0,120 Z"
          fill="oklch(97.5% 0.006 244 / 0.8)"
        />
      </svg>
      <svg
        className="absolute bottom-0 w-[200%] h-full animate-wave-fast"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,90 C180,60 360,100 540,80 C720,60 900,90 1080,70 C1260,50 1380,80 1440,70 L1440,120 L0,120 Z"
          fill="oklch(97.5% 0.006 244)"
        />
      </svg>
    </div>
  );
}
