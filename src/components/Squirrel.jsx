import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';

const Squirrel = () => {
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [isTalking, setIsTalking] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [customAnimations, setCustomAnimations] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customAnimations');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  // API Key Management
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openaiApiKey') || '';
    }
    return '';
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const updateCustomStyles = (animations) => {
    const existingStyle = document.getElementById('custom-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    if (animations.length > 0) {
      const styleElement = document.createElement('style');
      styleElement.id = 'custom-styles';
      styleElement.textContent = animations.map(anim => anim.css).join('\n');
      document.head.appendChild(styleElement);
    }
  };

  // Initialize default animations
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Base transform origins */
      #tail { transform-origin: 90px 150px; }
      #head { transform-origin: 130px 110px; }
      #leftArm { transform-origin: 90px 150px; }
      #rightArm { transform-origin: 150px 150px; }
      #leftLeg { transform-origin: 100px 210px; }
      #rightLeg { transform-origin: 140px 210px; }

      /* Base responsive styles */
      .squirrel-container {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      
      @media (max-width: 640px) {
        .squirrel-container {
          max-width: 300px;
          min-height: 300px;
        }
      }

      /* Idle Animation */
      @keyframes idleBody {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      @keyframes idleTail {
        0%, 100% { transform: rotate(0); }
        50% { transform: rotate(15deg); }
      }
      .idle .squirrel {
        animation: idleBody 3s ease-in-out infinite;
      }
      .idle #tail {
        animation: idleTail 3s ease-in-out infinite;
      }

      /* Happy Animation */
      @keyframes happyBody {
        0%, 100% { transform: translateY(0) translate(0) scale(1); }
        25% { transform: translateY(-30px) translate(-20px) scale(1.1); }
        50% { transform: translateY(-40px) translate(0) scale(1.05); }
        75% { transform: translateY(-30px) translate(20px) scale(1.1); }
      }
      @keyframes happyTail {
        0%, 100% { transform: rotate(-10deg); }
        50% { transform: rotate(25deg); }
      }
      @keyframes happyArms {
        0%, 100% { transform: rotate(0); }
        50% { transform: rotate(-20deg); }
      }
      .happy .squirrel {
        animation: happyBody 2s ease-in-out infinite;
      }
      .happy #tail {
        animation: happyTail 0.7s ease-in-out infinite;
      }
      .happy #leftArm, .happy #rightArm {
        animation: happyArms 1s ease-in-out infinite alternate;
      }

      /* Wave Animation */
      @keyframes waveArm {
        0%, 100% { transform: rotate(0); }
        25% { transform: rotate(-45deg); }
        75% { transform: rotate(-30deg); }
      }
      @keyframes waveBody {
        0%, 100% { transform: rotate(0) translateX(0); }
        25% { transform: rotate(5deg) translateX(10px); }
        75% { transform: rotate(-5deg) translateX(-10px); }
      }
      .wave #rightArm {
        animation: waveArm 1s ease-in-out infinite;
      }
      .wave .squirrel {
        animation: waveBody 2s ease-in-out infinite;
      }

      /* Dance Animation */
      @keyframes danceBody {
        0%, 100% { transform: translateX(0) rotate(0) translateY(0); }
        25% { transform: translateX(-30px) rotate(-10deg) translateY(-20px); }
        50% { transform: translateX(0) rotate(0) translateY(0); }
        75% { transform: translateX(30px) rotate(10deg) translateY(-20px); }
      }
      @keyframes danceArms {
        0%, 100% { transform: rotate(0); }
        25% { transform: rotate(45deg); }
        75% { transform: rotate(-45deg); }
      }
      @keyframes danceTail {
        0%, 100% { transform: rotate(0); }
        25% { transform: rotate(30deg); }
        75% { transform: rotate(-30deg); }
      }
      .dance .squirrel {
        animation: danceBody 1s ease-in-out infinite;
      }
      .dance #leftArm, .dance #rightArm {
        animation: danceArms 1s ease-in-out infinite;
      }
      .dance #tail {
        animation: danceTail 1s ease-in-out infinite;
      }

      /* Excited Animation */
      @keyframes excitedBody {
        0%, 100% { transform: translateY(0) translateX(0) scale(1) rotate(0); }
        25% { transform: translateY(-40px) translateX(-30px) scale(1.1) rotate(-5deg); }
        50% { transform: translateY(-50px) translateX(0) scale(1.05) rotate(0); }
        75% { transform: translateY(-40px) translateX(30px) scale(1.1) rotate(5deg); }
      }
      @keyframes excitedTail {
        0% { transform: rotate(-20deg); }
        25% { transform: rotate(30deg); }
        50% { transform: rotate(-20deg); }
        75% { transform: rotate(30deg); }
      }
      @keyframes excitedArms {
        0%, 100% { transform: rotate(0); }
        50% { transform: rotate(-25deg); }
      }
      .excited .squirrel {
        animation: excitedBody 0.7s ease-in-out infinite;
      }
      .excited #tail {
        animation: excitedTail 0.7s ease-in-out infinite;
      }
      .excited #leftArm, .excited #rightArm {
        animation: excitedArms 0.7s ease-in-out alternate infinite;
      }

      /* Waiting Animation */
      @keyframes waitingBody {
        0%, 100% { transform: translateY(0) rotate(-2deg); }
        50% { transform: translateY(-5px) rotate(2deg); }
      }
      @keyframes waitingArms {
        0%, 100% { transform: rotate(0); }
        50% { transform: rotate(10deg); }
      }
      @keyframes waitingTail {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }
      .waiting .squirrel {
        animation: waitingBody 1s ease-in-out infinite;
      }
      .waiting #leftArm {
        d: path('M90 150 Q85 160 90 170');
        animation: waitingArms 2s ease-in-out infinite;
      }
      .waiting #rightArm {
        d: path('M150 150 Q155 160 150 170');
        animation: waitingArms 2s ease-in-out infinite;
      }
      .waiting #tail {
        animation: waitingTail 2s ease-in-out infinite;
      }

      /* Talk Animation */
      @keyframes talk {
        0%, 100% { d: path('M125 115 Q130 118 135 115'); }
        50% { d: path('M125 115 Q130 123 135 115'); }
      }
      #mouthPath {
        animation: ${isTalking ? 'talk 0.4s ease-in-out infinite' : 'none'};
      }
    `;
    document.head.appendChild(styleElement);

    return () => styleElement.remove();
  }, [isTalking]);

  // Apply custom animations when component mounts
  useEffect(() => {
    updateCustomStyles(customAnimations);
  }, []);
  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('openaiApiKey', apiKey.trim());
      setShowApiKeyInput(false);
      setErrorMessage('');
    }
  };

  const handleDeleteAnimation = (animationId) => {
    setCustomAnimations(prev => {
      const filtered = prev.filter(anim => anim.id !== animationId);
      localStorage.setItem('customAnimations', JSON.stringify(filtered));

      if (currentAnimation === animationId) {
        setCurrentAnimation('idle');
      }

      updateCustomStyles(filtered);
      
      return filtered;
    });
  };

  const handleAiAnimation = async () => {
    if (!aiPrompt) {
      setErrorMessage('Please enter an animation description');
      return;
    }

    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setIsGenerating(true);
    setCurrentAnimation('waiting');
    setErrorMessage('');

    try {
      const isClaudeKey = apiKey.startsWith('sk-ant');
      
      const animationPrompt = `Create a dynamic CSS animation for a squirrel character. Generate precise CSS that creates fluid, natural movement using these guidelines:

SVG Structure:
- Main squirrel group (.squirrel): Container for all elements
- Body parts with IDs: body, head, leftArm, rightArm, leftLeg, rightLeg, tail
- Face elements: eyes, mouth groups

Animation Requirements:
1. Use multiple keyframes for complex movements
2. Combine translations, rotations, and scaling
3. The squirrel can move freely within a 300x400px space
4. Chain multiple animations for different body parts
5. Create natural motion with proper easing
6. Include secondary animations (e.g., tail wagging while jumping)

Desired movement: ${aiPrompt}

Return ONLY the CSS code in this format:
.animation-name .squirrel { animation: mainMove Xs ease-in-out infinite; }
@keyframes mainMove {
  0% { transform: translate(Xpx, Ypx) rotate(Zdeg) scale(S); }
  ...additional keyframes...
  100% { transform: match starting position; }
}

Add part-specific animations as needed:
.animation-name #tail { animation: tailMove Xs ease-in-out infinite; }
@keyframes tailMove { ... }

Safe ranges for transforms:
- translate: -100px to 100px
- rotate: -180deg to 180deg
- scale: 0.8 to 1.2

Return only the CSS without any markdown or explanations.`;

      let animationCSS;

      if (isClaudeKey) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-opus-20240229',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: animationPrompt
            }]
          })
        });

        if (!response.ok) throw new Error('Claude API request failed');
        const data = await response.json();
        animationCSS = data.content[0].text;
      } else {
        const openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        });

        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: "You are an expert at creating complex CSS animations. Return only CSS code."
          }, {
            role: "user",
            content: animationPrompt
          }],
          temperature: 0.7,
          max_tokens: 1000
        });

        animationCSS = response.choices[0].message.content;
      }

      // Clean up the CSS response
      const cleanedCSS = animationCSS
        .replace(/```css/g, '')
        .replace(/```/g, '')
        .trim();

      const animationName = `custom_${Date.now()}`;
      const css = cleanedCSS.replace(/animation-name/g, animationName);

      const newAnimation = {
        id: animationName,
        name: `✨ ${aiPrompt.slice(0, 20)}${aiPrompt.length > 20 ? '...' : ''}`,
        css: css,
        description: aiPrompt
      };

      const updatedAnimations = [...customAnimations, newAnimation];
      setCustomAnimations(updatedAnimations);
      
      // Update styles
      updateCustomStyles(updatedAnimations);
      
      setCurrentAnimation(animationName);
      setAiPrompt('');
    } catch (error) {
      setErrorMessage(`Failed to generate animation: ${error.message}`);
      setCurrentAnimation('idle');
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* API Key Modal */}
        {showApiKeyInput && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Enter Your API Key</h2>
              <form onSubmit={handleApiKeySubmit} className="space-y-4">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter OpenAI or Claude API key..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApiKeyInput(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI Animation Input */}
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold">Create Animation</h2>
            <button
              onClick={() => setShowApiKeyInput(true)}
              disabled={isGenerating}
              className="text-purple-500 hover:text-purple-700 disabled:text-gray-400 transition-colors"
            >
              Configure API Key
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Try: 'do a backflip', 'run in circles', 'dance with joy'..."
              disabled={isGenerating}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 
                       disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            />
            <button
              onClick={handleAiAnimation}
              disabled={isGenerating}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                       disabled:bg-gray-400 disabled:cursor-not-allowed transition-all
                       transform active:scale-95 whitespace-nowrap"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Animation Controls */}
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-bold mb-3">Default Animations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {['idle', 'happy', 'wave', 'dance', 'excited'].map((anim) => (
              <button
                key={anim}
                onClick={() => setCurrentAnimation(anim)}
                disabled={isGenerating}
                className={`p-4 rounded-lg text-white font-medium transition-all
                          transform active:scale-95 ${
                  currentAnimation === anim
                    ? 'bg-blue-600 ring-4 ring-blue-200'
                    : 'bg-blue-500 hover:bg-blue-600'
                } disabled:bg-gray-400 disabled:cursor-not-allowed`}
              >
                {anim.charAt(0).toUpperCase() + anim.slice(1)}
              </button>
            ))}
          </div>

          {customAnimations.length > 0 && (
            <>
              <h3 className="text-lg font-bold mt-6 mb-3">Custom Animations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {customAnimations.map((anim) => (
                  <div key={anim.id} className="relative group">
                    <button
                      onClick={() => setCurrentAnimation(anim.id)}
                      disabled={isGenerating}
                      className={`w-full p-4 rounded-lg text-white font-medium transition-all
                                transform active:scale-95 ${
                        currentAnimation === anim.id
                          ? 'bg-purple-600 ring-4 ring-purple-200'
                          : 'bg-purple-500 hover:bg-purple-600'
                      } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                    >
                      {anim.name}
                    </button>
                    <button
                      onClick={() => handleDeleteAnimation(anim.id)}
                      disabled={isGenerating}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white 
                               hover:bg-red-600 flex items-center justify-center transform
                               transition-all opacity-0 group-hover:opacity-100
                               disabled:bg-gray-400 disabled:cursor-not-allowed"
                      aria-label="Delete animation"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Squirrel Display */}
        <div className={`bg-white rounded-xl shadow-xl p-4 sm:p-8 mb-6 ${currentAnimation}`}>
          <div className="squirrel-container">
            <svg className="squirrel w-full h-full" viewBox="0 0 200 300">
              {/* Tail */}
              <path
                id="tail"
                d="M90 150 Q60 120 40 150 Q20 180 40 200 Q60 220 90 190"
                fill="#8B4513"
                stroke="#654321"
                strokeWidth="2"
              />

              {/* Body */}
              <ellipse
                id="body"
                cx="120"
                cy="170"
                rx="40"
                ry="50"
                fill="#8B4513"
                stroke="#654321"
                strokeWidth="2"
              />

              {/* Left Arm */}
              <path
                id="leftArm"
                d="M90 150 Q70 170 80 190"
                fill="none"
                stroke="#654321"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Right Arm */}
              <path
                id="rightArm"
                d="M150 150 Q170 170 160 190"
                fill="none"
                stroke="#654321"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Legs */}
              <path
                id="leftLeg"
                d="M100 210 Q90 230 100 240"
                fill="none"
                stroke="#654321"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                id="rightLeg"
                d="M140 210 Q150 230 140 240"
                fill="none"
                stroke="#654321"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Head */}
              <circle
                id="head"
                cx="130"
                cy="110"
                r="35"
                fill="#8B4513"
                stroke="#654321"
                strokeWidth="2"
              />

              {/* Face Details */}
              <path
                d="M100 80 Q110 60 120 80"
                fill="none"
                stroke="#654321"
                strokeWidth="3"
              />
              <path
                d="M140 80 Q150 60 160 80"
                fill="none"
                stroke="#654321"
                strokeWidth="3"
              />
              <ellipse id="nose" cx="130" cy="110" rx="5" ry="4" fill="#654321" />

              {/* Eyes */}
              <g id="eyes">
                <circle cx="120" cy="100" r="8" fill="white" stroke="#654321" strokeWidth="1" />
                <circle cx="140" cy="100" r="8" fill="white" stroke="#654321" strokeWidth="1" />
                <circle id="leftPupil" cx="120" cy="100" r="4" fill="black" />
                <circle id="rightPupil" cx="140" cy="100" r="4" fill="black" />
              </g>

              {/* Mouth */}
              <g id="mouth">
                <path
                  d="M125 115 Q130 120 135 115"
                  fill="#4a1f05"
                  stroke="none"
                />
                <path
                  id="mouthPath"
                  d="M125 115 Q130 118 135 115"
                  fill="none"
                  stroke="#654321"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Talk Toggle */}
        {/* <div className="mt-6 flex justify-center">
          <button
            onClick={() => setIsTalking(!isTalking)}
            disabled={isGenerating}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-all
                       transform active:scale-95 ${
              isTalking ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {isTalking ? '🤫 Stop Talking' : '🗣 Start Talking'}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Squirrel;