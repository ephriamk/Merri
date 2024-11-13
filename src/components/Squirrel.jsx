import React, { useState, useEffect } from 'react';

const SquirrelApp = () => {
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const moveEye = (pupil, baseX) => {
        const maxMove = 3;
        const rect = document.querySelector('.squirrel')?.getBoundingClientRect();
        if (!rect) return;
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const dx = (x - rect.width/2) / rect.width * maxMove * 2;
        const dy = (y - rect.height/2) / rect.height * maxMove * 2;
        
        const limitedDx = Math.max(-maxMove, Math.min(maxMove, dx));
        const limitedDy = Math.max(-maxMove, Math.min(maxMove, dy));
        
        pupil.setAttribute('cx', baseX + limitedDx);
        pupil.setAttribute('cy', 100 + limitedDy);
      };

      const leftPupil = document.getElementById('leftPupil');
      const rightPupil = document.getElementById('rightPupil');
      if (leftPupil && rightPupil) {
        moveEye(leftPupil, 120);
        moveEye(rightPupil, 140);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const animations = [
    { id: 'idle', name: '🌿 Idle' },
    { id: 'jumpForJoy', name: '⭐ Jump for Joy' },
    { id: 'curious', name: '👀 Curious' },
    { id: 'nutCrazy', name: '🌰 Nut Crazy' },
    { id: 'tailParty', name: '🎉 Tail Party' },
    { id: 'celebrate', name: '🎈 Celebrate' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8 flex flex-col items-center justify-center">
      <div className={`bg-white rounded-lg shadow-xl p-8 mb-6 ${currentAnimation}`}>
        <style>{`
          /* Idle - gentle swaying with occasional tail flick */
          @keyframes idleBody {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(0, -3px); }
          }
          @keyframes idleTail {
            0%, 90%, 100% { transform: rotate(0); }
            95% { transform: rotate(15deg); }
          }
          .idle .squirrel {
            animation: idleBody 3s ease-in-out infinite;
          }
          .idle #tail {
            animation: idleTail 6s ease-in-out infinite;
          }

          /* Jump for Joy - enthusiastic jumping with anticipation */
          @keyframes jumpBody {
            0%, 100% { transform: translate(0, 0) scale(1, 1); }
            10% { transform: translate(0, 0) scale(1.05, 0.95); }
            40% { transform: translate(0, -30px) scale(0.95, 1.05); }
            45% { transform: translate(0, -30px) scale(0.95, 1.05); }
            100% { transform: translate(0, 0) scale(1, 1); }
          }
          @keyframes jumpTail {
            0%, 100% { transform: rotate(0deg); }
            40%, 45% { transform: rotate(-30deg); }
          }
          @keyframes jumpArms {
            0%, 100% { transform: rotate(0deg); }
            40%, 45% { transform: rotate(-45deg); }
          }
          .jumpForJoy .squirrel {
            animation: jumpBody 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
          .jumpForJoy #tail {
            animation: jumpTail 1.5s ease-in-out infinite;
          }
          .jumpForJoy #leftArm, .jumpForJoy #rightArm {
            animation: jumpArms 1.5s ease-in-out infinite;
          }

          /* Curious - eye zoom animation */
          @keyframes curiousBody {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-3deg); }
            75% { transform: rotate(3deg); }
          }
          @keyframes curiousEyes {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
          }
          @keyframes curiousPupils {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.8); }
          }
          @keyframes curiousTail {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(20deg); }
            75% { transform: rotate(-20deg); }
          }
          .curious .squirrel {
            animation: curiousBody 4s ease-in-out infinite;
          }
          .curious #eyes circle:not([id^="leftPupil"]):not([id^="rightPupil"]) {
            animation: curiousEyes 4s ease-in-out infinite;
            transform-origin: center;
          }
          .curious #leftPupil, .curious #rightPupil {
            animation: curiousPupils 4s ease-in-out infinite;
            transform-origin: center;
          }
          .curious #tail {
            animation: curiousTail 4s ease-in-out infinite;
          }

          /* Nut Crazy - excited bouncing and spinning */
          @keyframes nutCrazyBody {
            0%, 100% { transform: rotate(-5deg) translateY(0); }
            25% { transform: rotate(5deg) translateY(-10px); }
            50% { transform: rotate(-5deg) translateY(0); }
            75% { transform: rotate(5deg) translateY(-10px); }
          }
          @keyframes nutCrazyTail {
            0%, 100% { transform: rotate(-20deg); }
            50% { transform: rotate(20deg); }
          }
          @keyframes nutCrazyArms {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-30deg); }
            75% { transform: rotate(30deg); }
          }
          .nutCrazy .squirrel {
            animation: nutCrazyBody 0.5s ease-in-out infinite;
          }
          .nutCrazy #tail {
            animation: nutCrazyTail 0.25s ease-in-out infinite;
          }
          .nutCrazy #leftArm, .nutCrazy #rightArm {
            animation: nutCrazyArms 0.5s ease-in-out infinite;
          }

          /* Tail Party - energetic tail movement leads body */
          @keyframes tailPartyTail {
            0%, 100% { transform: rotate(-30deg); }
            50% { transform: rotate(30deg); }
          }
          @keyframes tailPartyBody {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
          }
          .tailParty #tail {
            animation: tailPartyTail 0.5s ease-in-out infinite;
          }
          .tailParty .squirrel {
            animation: tailPartyBody 0.5s ease-in-out infinite;
          }

          /* Celebrate - bouncy clapping celebration */
          @keyframes celebrateBody {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.05, 0.95); }
          }
          @keyframes celebrateArms {
            0%, 100% { transform: rotate(0deg) translateX(0); }
            50% { transform: rotate(-30deg) translateX(10px); }
          }
          @keyframes celebrateTail {
            0%, 100% { transform: rotate(-10deg); }
            50% { transform: rotate(10deg); }
          }
          .celebrate .squirrel {
            animation: celebrateBody 0.7s ease-in-out infinite;
          }
          .celebrate #leftArm {
            animation: celebrateArms 0.7s ease-in-out infinite;
          }
          .celebrate #rightArm {
            animation: celebrateArms 0.7s ease-in-out infinite reverse;
          }
          .celebrate #tail {
            animation: celebrateTail 0.35s ease-in-out infinite;
          }

          /* Talk animation */
          @keyframes talk {
            0%, 100% { d: path('M125 115 Q130 118 135 115'); }
            50% { d: path('M125 115 Q130 123 135 115'); }
          }
          #mouthPath { 
            animation: ${isTalking ? 'talk 400ms ease-in-out infinite' : 'none'}; 
          }

          /* Transform origins */
          #tail { transform-origin: 90px 150px; }
          #head { transform-origin: 130px 130px; }
          #leftArm { transform-origin: 90px 150px; }
          #rightArm { transform-origin: 150px 150px; }
        `}</style>
        
        <svg className="squirrel w-64 h-64" viewBox="0 0 200 300">
          <g id="tail">
            <path d="M90 150 Q60 120 40 150 Q20 180 40 200 Q60 220 90 190" 
                  fill="#8B4513" stroke="#654321" stroke-width="2"/>
          </g>
          
          <ellipse id="body" cx="120" cy="170" rx="40" ry="50" 
                   fill="#8B4513" stroke="#654321" stroke-width="2"/>
          
          <path id="leftArm" d="M90 150 Q70 170 80 190" 
                fill="none" stroke="#654321" stroke-width="4" stroke-linecap="round"/>
          <path id="rightArm" d="M150 150 Q170 170 160 190" 
                fill="none" stroke="#654321" stroke-width="4" stroke-linecap="round"/>
          
          <path id="leftLeg" d="M100 210 Q90 230 100 240" 
                fill="none" stroke="#654321" stroke-width="4" stroke-linecap="round"/>
          <path id="rightLeg" d="M140 210 Q150 230 140 240" 
                fill="none" stroke="#654321" stroke-width="4" stroke-linecap="round"/>
          
          <circle id="head" cx="130" cy="110" r="35" 
                  fill="#8B4513" stroke="#654321" stroke-width="2"/>
                  
          <path d="M100 80 Q110 60 120 80" fill="none" stroke="#654321" stroke-width="3"/>
          <path d="M140 80 Q150 60 160 80" fill="none" stroke="#654321" stroke-width="3"/>
          
          <g id="mouth">
            <path d="M125 115 Q130 120 135 115" fill="#4a1f05" stroke="none"/>
            <path id="mouthPath" d="M125 115 Q130 118 135 115"
                  fill="none" stroke="#654321" stroke-width="2" stroke-linecap="round"/>
          </g>
          
          <ellipse id="nose" cx="130" cy="110" rx="5" ry="4" fill="#654321"/>
          
          <g id="eyes">
            <circle cx="120" cy="100" r="8" fill="white" stroke="#654321" stroke-width="1"/>
            <circle cx="140" cy="100" r="8" fill="white" stroke="#654321" stroke-width="1"/>
            <circle id="leftPupil" cx="120" cy="100" r="4" fill="black"/>
            <circle id="rightPupil" cx="140" cy="100" r="4" fill="black"/>
          </g>
        </svg>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="grid grid-cols-3 gap-2">
          {animations.map((anim) => (
            <button
              key={anim.id}
              onClick={() => setCurrentAnimation(anim.id)}
              className={`px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                         transition-colors focus:ring-2 focus:outline-none text-lg
                         ${currentAnimation === anim.id ? 'ring-2 ring-offset-2 bg-blue-600' : ''}`}
            >
              {anim.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsTalking(!isTalking)}
          className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 
                     transition-colors focus:ring-2 focus:outline-none text-lg"
        >
          {isTalking ? '🤫 Stop Talking' : '🗣 Start Talking'}
        </button>
      </div>
    </div>
  );
};

export default SquirrelApp;