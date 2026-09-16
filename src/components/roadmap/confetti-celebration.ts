import confetti from "canvas-confetti";

export function triggerMilestoneCelebration() {
  // Check prefers-reduced-motion
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // Friendly celebratory pop with warm sunshine yellow, coral, and indigo particles
  const count = 75;
  const defaults = {
    origin: { y: 0.7 },
    colors: ["#FFC94A", "#FF7A5C", "#3B3B98", "#FFE699", "#10B981"],
    ticks: 200,
    gravity: 1.1,
    scalar: 1.05,
    disableForReducedMotion: true,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 45,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 40,
  });
}
