"use client";

export function WaterBackground() {
  const bubbles = Array.from({ length: 10 }, (_, i) => ({
    left: `${(i * 19 + 9) % 100}%`,
    size: 6 + (i % 3) * 8,
    delay: `${(i * 1.3) % 8}s`,
    duration: `${18 + (i % 4) * 5}s`,
  }));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Apple: very subtle, almost invisible water — keep brand but deferent */}
      <svg className="absolute top-0 left-0 w-[120%] h-[140px] wave-1 opacity-[0.03]" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#007AFF" d="M0,160 C240,220 480,60 720,140 C960,220 1200,280 1440,180 L1440,0 L0,0 Z" />
      </svg>
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="bubble absolute rounded-full bg-[#007AFF] bottom-0"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
        />
      ))}
    </div>
  );
}
