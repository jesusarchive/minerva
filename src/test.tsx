import React, { useRef, useState } from 'react';

import useVoice from '@/hooks/use-voice';

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const { listen, stopListening, finalTranscript } = useVoice();
  const timeoutRef = useRef<any>();

  const handleListenStart = () => {
    setIsListening(true);
    listen();
  };

  const handleListenStop = () => {
    setIsListening(false);
    stopListening();
    clearTimeout(timeoutRef.current);
  };

  const handleListenHold = () => {
    timeoutRef.current = setTimeout(() => {
      handleListenStop();
    }, 5000);
  };

  return (
    <div>
      <button
        onMouseDown={handleListenStart}
        onMouseUp={handleListenStop}
        onMouseLeave={handleListenStop}
        onTouchStart={handleListenStart}
        onTouchEnd={handleListenStop}
        onTouchCancel={handleListenStop}
        onTouchMove={handleListenHold}
      >
        {isListening ? 'Listening...' : 'Hold to Listen'}
      </button>
      <p>{finalTranscript}</p>
    </div>
  );
};

export default App;
