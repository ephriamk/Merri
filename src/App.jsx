import React, { useState, useRef, useEffect } from 'react';
import IntroPage from './components/IntroPage';
import Squirrel from './components/Squirrel';

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.2);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef(null);

  // Function to load audio with both local and production paths
  const loadAudio = async () => {
    try {
      // Try production URL first (assuming the file is in public folder)
      const audioUrl = '/merri.mp3';
      const response = await fetch(audioUrl);
      
      if (response.ok) {
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.volume = volume;
          setAudioLoaded(true);
        }
      } else {
        // Fallback to local development path
        if (audioRef.current) {
          audioRef.current.src = '/src/assets/merri.mp3';
          audioRef.current.volume = volume;
          setAudioLoaded(true);
        }
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  useEffect(() => {
    loadAudio();
  }, []);

  useEffect(() => {
    if (audioLoaded && audioRef.current) {
      audioRef.current.volume = volume;
      
      const playAttempt = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.log('Autoplay prevented:', err);
          setIsPlaying(false);
        }
      };

      playAttempt();
    }
  }, [audioLoaded]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
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
    <div className="min-h-screen relative">
      {/* Audio Player */}
      <audio ref={audioRef} loop>
        Your browser does not support the audio element.
      </audio>

      {showIntro ? (
        <IntroPage onEnter={() => setShowIntro(false)} />
      ) : (
        <Squirrel />
      )}

      {/* Audio Controls */}
      <div className="fixed bottom-4 right-4 flex flex-col items-center gap-2 z-50">
        <button
          onClick={toggleAudio}
          className="group relative w-12 h-12 rounded-full bg-pink-500 text-white shadow-lg 
                   hover:scale-110 transform transition-all flex items-center justify-center"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-6 h-6 transition-colors ${isPlaying ? 'text-white' : 'text-white'}`}
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
          <div className="absolute inset-0 bg-pink-500 opacity-50 rounded-full blur-xl transition-opacity 
                        group-hover:opacity-75" />
        </button>

        {/* Volume Slider with improved styling */}
        <div className="relative group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 rounded-lg appearance-none cursor-pointer bg-pink-200
                     accent-pink-500 hover:accent-pink-600 transition-all"
            aria-label="Volume control"
          />
          <div className="absolute left-0 right-0 -bottom-6 opacity-0 group-hover:opacity-100 
                        transition-opacity text-xs text-center text-pink-500 font-medium">
            {Math.round(volume * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;