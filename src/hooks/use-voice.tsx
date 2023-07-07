import { useEffect, useState } from 'react';

export default function useVoice(lang = 'en-US') {
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = lang;
    setUtterance(utterance);
  }, [lang]);

  const speak = (text: string) => {
    if (utterance) {
      utterance.text = text;
      window.speechSynthesis.speak(utterance);
    }
  };

  return {
    speak,
  };
}
