import React, { useState } from 'react';
import IntroPage from './components/IntroPage';
import Squirrel from './components/Squirrel';

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro ? (
        <IntroPage onEnter={() => setShowIntro(false)} />
      ) : (
        <Squirrel />
      )}
    </>
  );
};

export default App;
