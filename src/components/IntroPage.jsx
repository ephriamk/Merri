import React, { useState, useEffect, useRef } from 'react';

const IntroPage = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);
  const mainCanvasRef = useRef(null);
  const secondaryCanvasRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const drawText = (canvas, text, fontSize, delay) => {
      const ctx = canvas.getContext('2d');
      ctx.font = `${fontSize}px 'Loved by the King', cursive`;
      ctx.lineWidth = 2;
      ctx.strokeStyle = ctx.fillStyle = '#FFF';

      const textWidth = ctx.measureText(text).width;
      const x = (canvas.width - textWidth) / 2;
      const y = canvas.height / 2 + fontSize / 3;

      let i = 0;

      const drawCharacter = () => {
        if (i < text.length) {
          ctx.fillText(text[i], x + ctx.measureText(text.slice(0, i)).width, y);
          i++;
          setTimeout(drawCharacter, delay);
        }
      };

      drawCharacter();
    };

    drawText(mainCanvasRef.current, 'Merri', 80, 200);
    drawText(secondaryCanvasRef.current, 'Loves you ', 40, 150);
  }, []);

  const handleEnter = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    setIsExiting(true);
    setTimeout(onEnter, 1000);
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b 
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
      <div className="relative z-10 text-center space-y-4">
        <canvas ref={mainCanvasRef} width={640} height={150} className="mb-4" />
        <canvas ref={secondaryCanvasRef} width={640} height={100} className="mb-8" />
        <button
          onClick={handleEnter}
          className="neuromorphic-button px-6 py-2 text-md font-bold rounded-full text-gray-700"
        >
          <p className="text-center ">Enter Merri's World</p>
        </button>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} src="/path/to/click.wav" preload="auto" />

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

        .neuromorphic-button {
          background: #e0e0e0;
          box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;
          transition: all 0.2s ease-in-out;
        }

        .neuromorphic-button:hover {
          box-shadow: 4px 4px 8px #bebebe, -4px -4px 8px #ffffff;
        }

        .neuromorphic-button:active {
          box-shadow: inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff;
        }
      `}</style>
    </div>
  );
};

export default IntroPage;
