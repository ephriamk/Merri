import React, { useState, useRef, useEffect } from 'react';
import IntroPage from './components/IntroPage';
import Squirrel from './components/Squirrel';

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const audioRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.pause();
    }

    // Add click outside listener
    const handleClickOutside = (event) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target)) {
        setIsControlsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error('Playback failed:', error);
            setIsPlaying(false);
          });
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <audio 
        ref={audioRef} 
        loop 
        src="./merri.mp3"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        Your browser does not support the audio element.
      </audio>

      {showIntro ? (
        <IntroPage onEnter={() => setShowIntro(false)} />
      ) : (
        <Squirrel />
      )}

      {/* Responsive Audio Controls */}
      <div 
        ref={controlsRef}
        className="fixed bottom-4 right-4 z-50"
      >
        <div 
          className={`
            relative flex items-center
            transition-all duration-300 ease-in-out
            ${isControlsOpen ? 'bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg' : ''}
          `}
        >
          {/* Expanded Controls */}
          <div 
            className={`
              flex items-center gap-3
              transition-all duration-300 ease-in-out
              ${isControlsOpen ? 'opacity-100 mr-3' : 'opacity-0 w-0 overflow-hidden'}
            `}
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1.5 rounded-full bg-pink-200 appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:h-3
                         [&::-webkit-slider-thumb]:w-3
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-pink-500"
                aria-label="Volume control"
              />
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => {
              if (!isControlsOpen) {
                setIsControlsOpen(true);
              }
              toggleAudio();
            }}
            className={`
              w-10 h-10 rounded-full bg-pink-500 text-white 
              flex items-center justify-center 
              hover:bg-pink-600 transition-all shadow-md
              relative overflow-hidden
              ${isControlsOpen ? 'shadow-lg' : 'shadow-xl'}
            `}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
            <div className="absolute inset-0 bg-pink-500 opacity-50 rounded-full blur-lg transition-opacity group-hover:opacity-75" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;