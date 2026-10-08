import React, { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  style: React.CSSProperties;
}

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const palette = ["#fde047", "#f97316", "#ec4899", "#8b5cf6"] as const;
    const newPieces: ConfettiPiece[] = Array.from({ length: 150 }, (_, id) => ({
      id,
      style: {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 0.5}s`,
        backgroundColor: palette[Math.floor(Math.random() * palette.length)],
        width: `${Math.random() * 8 + 4}px`,
        height: `${Math.random() * 8 + 4}px`,
        opacity: Math.random() * 0.5 + 0.5,
        transform: `rotate(${Math.random() * 360}deg)`,
      },
    }));

    setPieces(newPieces);
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-50 h-full w-full overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="animate-fall absolute top-[-20px] rounded-full"
          style={piece.style}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Confetti;
