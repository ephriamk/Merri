import React, { useState, useRef, useEffect } from 'react';
import IntroPage from './components/IntroPage';
import Squirrel from './components/Squirrel';

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true); // Start playing by default
  const [volume, setVolume] = useState(0.2); // Start at 20% volume
  const audioRef = useRef(null);

  useEffect(() => {
    // Attempt to autoplay the audio on page load
    if (audioRef.current) {
      audioRef.current.volume = volume;

      // Try playing immediately
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
        // Retry after a short delay
        setTimeout(() => {
          audioRef.current.play().catch(() => {
            console.log('Autoplay still restricted by browser.');
          });
        }, 1000); // Delay retry by 1 second
      });
    }
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Audio Player */}
      <audio ref={audioRef} loop>
        <source src="src/assets/merri.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {showIntro ? (
        <IntroPage onEnter={() => setShowIntro(false)} />
      ) : (
        <Squirrel />
      )}

      {/* Audio Control Button */}
      <div className="fixed bottom-4 right-4 flex flex-col items-center z-50">
        <button
          onClick={toggleAudio}
          className={`w-12 h-12 rounded-full bg-pink-500 text-white shadow-lg hover:scale-110 
          transform transition-all flex items-center justify-center relative`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-6 h-6 ${isPlaying ? 'text-green-400' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isPlaying ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
            )}
          </svg>
          <div
            className="absolute w-16 h-16 bg-pink-500 opacity-50 rounded-full blur-xl"
            style={{ zIndex: -1 }}
          ></div>
        </button>

        {/* Volume Slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 mt-2 accent-pink-500"
        />
      </div>
    </div>
  );
};

export default App;
