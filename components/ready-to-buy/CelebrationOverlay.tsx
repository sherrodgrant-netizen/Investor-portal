"use client";

import { useEffect, useState, useCallback } from "react";

interface CelebrationOverlayProps {
  onComplete: () => void;
}

interface Particle {
  id: number;
  type: "diamond" | "shard" | "sparkle" | "bill" | "ring";
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  velocityX: number;
  velocityY: number;
  opacity: number;
  delay: number;
  color: string;
  duration: number;
}

export default function CelebrationOverlay({ onComplete }: CelebrationOverlayProps) {
  const [phase, setPhase] = useState<"buildup" | "shatter" | "rain" | "text" | "fade">("buildup");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showText, setShowText] = useState(false);
  const [shockwave, setShockwave] = useState(false);
  const [shockwave2, setShockwave2] = useState(false);

  const generateParticles = useCallback(() => {
    const items: Particle[] = [];
    const centerX = 50;
    const centerY = 50;

    const diamondColors = [
      "#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8",
      "#818CF8", "#6366F1", "#4F46E5",
      "#A5B4FC", "#93C5FD", "#BFDBFE",
      "#38BDF8", "#0EA5E9", "#0284C7",
      "#C7D2FE", "#E0E7FF", "#DBEAFE",
    ];

    const shardColors = [
      "#93C5FD", "#60A5FA", "#3B82F6",
      "#A5B4FC", "#818CF8", "#6366F1",
      "#BAE6FD", "#7DD3FC", "#38BDF8",
      "#FFFFFF", "#E0E7FF", "#DBEAFE",
    ];

    // Wave 1 — Main diamond explosion from center (huge burst)
    for (let i = 0; i < 120; i++) {
      const angle = (Math.PI * 2 * i) / 120 + (Math.random() - 0.5) * 0.3;
      const speed = 2 + Math.random() * 10;
      items.push({
        id: i,
        type: "diamond",
        x: centerX,
        y: centerY,
        size: 14 + Math.random() * 45,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 1.5,
        opacity: 1,
        delay: Math.random() * 150,
        color: diamondColors[Math.floor(Math.random() * diamondColors.length)],
        duration: 3.5 + Math.random() * 1.5,
      });
    }

    // Wave 2 — Crystal shards (sharp thin pieces)
    for (let i = 0; i < 90; i++) {
      const angle = (Math.PI * 2 * i) / 90 + (Math.random() - 0.5) * 0.6;
      const speed = 4 + Math.random() * 12;
      items.push({
        id: 120 + i,
        type: "shard",
        x: centerX + (Math.random() - 0.5) * 4,
        y: centerY + (Math.random() - 0.5) * 4,
        size: 8 + Math.random() * 20,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 30,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 2,
        opacity: 1,
        delay: 50 + Math.random() * 200,
        color: shardColors[Math.floor(Math.random() * shardColors.length)],
        duration: 2.5 + Math.random() * 1.5,
      });
    }

    // Wave 3 — Ice sparkles (tiny bright points)
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 14;
      items.push({
        id: 210 + i,
        type: "sparkle",
        x: centerX + (Math.random() - 0.5) * 8,
        y: centerY + (Math.random() - 0.5) * 8,
        size: 2 + Math.random() * 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 40,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        opacity: 1,
        delay: Math.random() * 300,
        color: ["#FFFFFF", "#DBEAFE", "#BFDBFE", "#93C5FD", "#E0E7FF", "#C7D2FE", "#A5B4FC"][Math.floor(Math.random() * 7)],
        duration: 1.8 + Math.random() * 1.5,
      });
    }

    // Money bills — fewer, but still present
    const moneyColors = ["#22C55E", "#16A34A", "#15803D", "#4ADE80"];
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20 + (Math.random() - 0.5) * 0.8;
      const speed = 2 + Math.random() * 6;
      items.push({
        id: 360 + i,
        type: "bill",
        x: centerX,
        y: centerY,
        size: 24 + Math.random() * 20,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 1,
        opacity: 1,
        delay: 200 + Math.random() * 400,
        color: moneyColors[Math.floor(Math.random() * moneyColors.length)],
        duration: 3.5 + Math.random() * 1,
      });
    }

    // Second explosion wave — delayed burst of diamonds
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60 + (Math.random() - 0.5) * 0.4;
      const speed = 3 + Math.random() * 7;
      items.push({
        id: 380 + i,
        type: "diamond",
        x: centerX,
        y: centerY,
        size: 10 + Math.random() * 30,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 18,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 2,
        opacity: 1,
        delay: 400 + Math.random() * 200,
        color: diamondColors[Math.floor(Math.random() * diamondColors.length)],
        duration: 3 + Math.random() * 1.5,
      });
    }

    // Rain wave — diamonds falling from above
    for (let i = 0; i < 80; i++) {
      items.push({
        id: 440 + i,
        type: i % 5 === 0 ? "bill" : "diamond",
        x: Math.random() * 100,
        y: -10 - Math.random() * 40,
        size: 12 + Math.random() * 28,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: 1.5 + Math.random() * 3.5,
        opacity: 1,
        delay: 1000 + Math.random() * 3000,
        color: i % 5 === 0
          ? moneyColors[Math.floor(Math.random() * moneyColors.length)]
          : diamondColors[Math.floor(Math.random() * diamondColors.length)],
        duration: 3 + Math.random() * 2,
      });
    }

    return items;
  }, []);

  useEffect(() => {
    setParticles(generateParticles());

    const timers = [
      // Buildup: giant diamond grows (0-800ms)
      setTimeout(() => {
        setShockwave(true);
        setPhase("shatter");
      }, 800),
      // Second shockwave
      setTimeout(() => setShockwave2(true), 1200),
      // Rain phase
      setTimeout(() => setPhase("rain"), 1400),
      // Text appears
      setTimeout(() => {
        setPhase("text");
        setShowText(true);
      }, 2000),
      // Fade
      setTimeout(() => setPhase("fade"), 5800),
      setTimeout(() => onComplete(), 7000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [generateParticles, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden transition-opacity duration-1000 ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "#030712" }}
    >
      {/* Deep blue ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: phase === "buildup" ? "200px" : "1200px",
          height: phase === "buildup" ? "200px" : "1200px",
          background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(99,102,241,0.12) 30%, rgba(30,58,138,0.08) 55%, transparent 75%)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Secondary glow pulse */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: phase === "buildup" ? "0px" : "600px",
          height: phase === "buildup" ? "0px" : "600px",
          background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(99,102,241,0.1) 50%, transparent 70%)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          animation: phase !== "buildup" ? "glowPulse 2s ease-in-out infinite" : "none",
        }}
      />

      {/* Flash on shatter */}
      {phase !== "buildup" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(147,197,253,0.9), rgba(59,130,246,0.4), transparent 70%)",
            animation: "flashBurst 0.5s ease-out forwards",
          }}
        />
      )}

      {/* Shockwave ring 1 */}
      {shockwave && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            animation: "shockwaveExpand 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            border: "2px solid rgba(147,197,253,0.6)",
            boxShadow: "0 0 30px rgba(59,130,246,0.3), inset 0 0 30px rgba(59,130,246,0.1)",
          }}
        />
      )}

      {/* Shockwave ring 2 */}
      {shockwave2 && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            animation: "shockwaveExpand 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            border: "1px solid rgba(165,180,252,0.4)",
            boxShadow: "0 0 20px rgba(99,102,241,0.2)",
          }}
        />
      )}

      {/* Light rays from center */}
      {phase !== "buildup" && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: "raysAppear 1.5s ease-out forwards" }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`ray-${i}`}
              className="absolute"
              style={{
                width: "2px",
                height: "300px",
                background: `linear-gradient(to bottom, rgba(147,197,253,${0.4 - i * 0.02}), transparent)`,
                transformOrigin: "top center",
                transform: `rotate(${i * 30}deg)`,
                left: "-1px",
                top: "0",
              }}
            />
          ))}
        </div>
      )}

      {/* Giant center diamond — builds up then shatters */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          animation: phase === "buildup"
            ? "diamondBuildup 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards"
            : "diamondShatter 0.6s cubic-bezier(0.55, 0, 1, 0.45) forwards",
        }}
      >
        <svg width="200" height="200" viewBox="0 0 100 100" fill="none" style={{
          filter: "drop-shadow(0 0 60px rgba(59,130,246,0.8)) drop-shadow(0 0 120px rgba(99,102,241,0.4))",
        }}>
          {/* Main body */}
          <path d="M50 5L10 35L50 95L90 35L50 5Z" fill="url(#bigDiamondGrad)" />
          {/* Top facet */}
          <path d="M50 5L25 35H75L50 5Z" fill="url(#topFacet)" />
          {/* Left facet */}
          <path d="M10 35L50 95L25 35H10Z" fill="#4F46E5" fillOpacity={0.6} />
          {/* Right facet */}
          <path d="M90 35L50 95L75 35H90Z" fill="#3B82F6" fillOpacity={0.4} />
          {/* Center line highlights */}
          <path d="M25 35L50 95L75 35" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <path d="M50 5L25 35M50 5L75 35" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          {/* Gleam */}
          <path d="M35 20L45 15L50 25L40 28Z" fill="white" fillOpacity={0.3} />
          <circle cx="38" cy="22" r="2" fill="white" fillOpacity={0.5} />
          <defs>
            <linearGradient id="bigDiamondGrad" x1="50" y1="5" x2="50" y2="95">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="30%" stopColor="#3B82F6" />
              <stop offset="60%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#312E81" />
            </linearGradient>
            <linearGradient id="topFacet" x1="50" y1="5" x2="50" y2="35">
              <stop offset="0%" stopColor="#DBEAFE" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `particleMove_${p.id} ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}ms forwards`,
            opacity: 0,
          }}
        >
          {p.type === "diamond" && (
            <svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{ filter: `drop-shadow(0 0 ${p.size * 0.3}px ${p.color})` }}>
              <path d="M50 5L10 35L50 95L90 35L50 5Z" fill={p.color} />
              <path d="M50 5L25 35H75L50 5Z" fill="white" fillOpacity={0.35} />
              <path d="M10 35L50 95L25 35H10Z" fill={p.color} fillOpacity={0.6} />
              <path d="M25 35L50 95L75 35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </svg>
          )}
          {p.type === "shard" && (
            <svg width={p.size * 0.6} height={p.size} viewBox="0 0 30 50" fill="none" style={{ filter: `drop-shadow(0 0 ${p.size * 0.4}px ${p.color})` }}>
              <path d="M15 0L0 20L10 50L25 30L30 10Z" fill={p.color} />
              <path d="M15 0L5 15L20 12Z" fill="white" fillOpacity={0.4} />
            </svg>
          )}
          {p.type === "sparkle" && (
            <div
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                borderRadius: "50%",
                boxShadow: `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 4}px ${p.color}40`,
              }}
            />
          )}
          {p.type === "bill" && (
            <div
              style={{
                width: p.size * 1.6,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: 3,
                border: "1.5px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: p.size * 0.45,
                fontWeight: "bold",
                color: "rgba(255,255,255,0.7)",
                boxShadow: `0 0 12px ${p.color}60`,
              }}
            >
              $
            </div>
          )}
        </div>
      ))}

      {/* Floating diamond dust — ambient particles */}
      {phase !== "buildup" && (
        <>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`dust-${i}`}
              className="absolute rounded-full"
              style={{
                width: 2 + Math.random() * 3,
                height: 2 + Math.random() * 3,
                background: ["#93C5FD", "#A5B4FC", "#FFFFFF", "#DBEAFE"][i % 4],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `dustFloat ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite`,
                opacity: 0.3 + Math.random() * 0.4,
              }}
            />
          ))}
        </>
      )}

      {/* Celebration Text */}
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div
            className="text-center"
            style={{ animation: "textReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          >
            <p
              className="text-5xl font-bold tracking-tight"
              style={{
                color: "rgba(219,234,254,0.95)",
                animation: "scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                textShadow: "0 0 40px rgba(59,130,246,0.5), 0 0 80px rgba(99,102,241,0.25)",
                letterSpacing: "0.02em",
              }}
            >
              Your purchase has been submitted!
            </p>
          </div>
        </div>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes flashBurst {
          0% { opacity: 0; }
          8% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes diamondBuildup {
          0% { transform: translate(-50%, -50%) scale(0) rotate(-30deg); opacity: 0; }
          60% { transform: translate(-50%, -50%) scale(1.3) rotate(5deg); opacity: 1; }
          80% { transform: translate(-50%, -50%) scale(1.1) rotate(-2deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.2) rotate(0deg); opacity: 1; }
        }

        @keyframes diamondShatter {
          0% { transform: translate(-50%, -50%) scale(1.2) rotate(0deg); opacity: 1; }
          30% { transform: translate(-50%, -50%) scale(1.8) rotate(10deg); opacity: 1; }
          60% { transform: translate(-50%, -50%) scale(2.5) rotate(-5deg); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(4) rotate(15deg); opacity: 0; }
        }

        @keyframes shockwaveExpand {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 120vmax; height: 120vmax; opacity: 0; }
        }

        @keyframes raysAppear {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          30% { opacity: 0.7; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes diamondShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes scaleIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes textReveal {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes dustFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }

        ${particles.map((p) => `
          @keyframes particleMove_${p.id} {
            0% {
              transform: translate(0, 0) rotate(${p.rotation}deg) scale(0);
              opacity: 0;
            }
            8% {
              opacity: 1;
              transform: translate(0, 0) rotate(${p.rotation}deg) scale(${p.type === "sparkle" ? 1.5 : 1.3});
            }
            20% {
              transform: translate(${p.velocityX * 8}vw, ${p.velocityY * 8}vh) rotate(${p.rotation + p.rotationSpeed * 4}deg) scale(1);
              opacity: 1;
            }
            55% {
              opacity: ${p.type === "sparkle" ? 0.5 : 0.75};
              transform: translate(${p.velocityX * 18}vw, ${p.velocityY * 18 + 12}vh) rotate(${p.rotation + p.rotationSpeed * 12}deg) scale(${p.type === "sparkle" ? 0.4 : 0.6});
            }
            100% {
              transform: translate(${p.velocityX * 24}vw, ${p.velocityY * 24 + 35}vh) rotate(${p.rotation + p.rotationSpeed * 24}deg) scale(0);
              opacity: 0;
            }
          }
        `).join("")}
      `}</style>
    </div>
  );
}
