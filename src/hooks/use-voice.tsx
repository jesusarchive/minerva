import { useEffect, useState } from 'react';

import { statusMessage } from '../data/config';

type UseVoiceProps = {
  defaultVoiceActive?: boolean;
  lang?: string;
  addFeedStatusElement: (text: string) => void;
};

export default function useVoice({
  defaultVoiceActive = false,
  lang = 'en-US',
  addFeedStatusElement,
}: UseVoiceProps) {
  const [voiceActive, setVoiceActive] = useState<boolean>(defaultVoiceActive);
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

  const activateVoice = () => {
    setVoiceActive(true);
    const feedbackText = `${statusMessage.voiceActive} on`;
    addFeedStatusElement(feedbackText);
    // TODO: update modes to voice
    // Differentiate between user and channel modes, when channel mode is voice we use the speak function, when user mode is voice we use the listen function for voice recognition
  };

  const deactivateVoice = () => {
    setVoiceActive(false);
    const feedbackText = `${statusMessage.voiceActive} off`;
    addFeedStatusElement(feedbackText);
    // TODO: update modes to voice
  };

  return {
    voiceActive,
    activateVoice,
    deactivateVoice,
    speak,
  };
}
