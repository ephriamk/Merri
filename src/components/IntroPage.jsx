import React, { useState } from 'react';

const IntroPage = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onEnter, 1000); // Matches fade-out duration
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-b 
                  from-pink-300 via-yellow-200 to-white transition-opacity duration-1000
                  ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Hearts */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-pink-400 rounded-full opacity-70 blur-md"
            style={{
              width: `${Math.random() * 40 + 10}px`,
              height: `${Math.random() * 40 + 10}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatHeart ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-8xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500 drop-shadow-lg">
          Merri
        </h1>
        <p className="text-4xl font-medium text-pink-700 mb-8 drop-shadow-md">Loves you 💖</p>
        <button
          onClick={handleEnter}
          className="relative px-12 py-4 text-lg font-bold rounded-full bg-gradient-to-r 
                     from-yellow-400 via-pink-400 to-red-400 hover:from-yellow-500 hover:to-red-500
                     text-white shadow-lg hover:shadow-2xl transition-transform transform-gpu 
                     hover:scale-110 active:scale-95 focus:outline-none"
        >
          <span
            className="absolute inset-0 bg-white opacity-20 blur-xl rounded-full animate-pulse"
          ></span>
          Enter Merri's World
        </button>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes floatHeart {
          0% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default IntroPage;
