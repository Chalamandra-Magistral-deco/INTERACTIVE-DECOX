import React, { useEffect, useState } from "react";

interface HeaderProps {
  completedCount: number;
  totalCount: number;
}

const Header: React.FC<HeaderProps> = ({ completedCount, totalCount }) => {
  const [heroText, setHeroText] = useState("");
  const fullHeroText = "El Sistema Operativo del 1%";
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    let index = 0;

    const typingInterval = window.setInterval(() => {
      if (index < fullHeroText.length) {
        setHeroText(fullHeroText.slice(0, index + 1));
        index += 1;
      } else {
        window.clearInterval(typingInterval);
      }
    }, 100);

    return () => window.clearInterval(typingInterval);
  }, []);

  return (
    <header className="hero-gradient relative px-6 py-20 text-center">
      <div className="mx-auto max-w-4xl">
        <h1 className="premium-glow mb-4 text-5xl font-black md:text-6xl">
          Chalamandra Magistral
        </h1>
        <p className="mb-8 h-10 text-2xl font-semibold text-white md:text-3xl">
          {heroText}
        </p>

        <div className="mx-auto max-w-md">
          <div
            className="h-4 overflow-hidden rounded-full bg-gray-800 shadow-inner"
            role="progressbar"
            aria-label="Progreso de Hacks Magistrales"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
          >
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-4 text-lg font-semibold text-white/80">
            {completedCount}/{totalCount} Hacks Magistrales Dominados (
            {progressPercent}%)
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
