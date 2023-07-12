import { useEffect, useState } from 'react';

type SpeakConfig = {
  lang?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
};

type ListenConfig = {
  lang?: string;
};

type Result = {
  transcript: string;
  isFinal: boolean;
};

type VoiceHook = {
  speak: (text: string, config?: Config) => Promise<SpeechSynthesisUtterance>;
  listen: (config?: Config) => void;
  listening: boolean;
  transcript: string;
  finalTranscript: string;
  stopListening: () => void;
};

const useVoice = (): VoiceHook => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition>();
  const [result, setResult] = useState<Result>({ transcript: '', isFinal: false });
  const [listening, setListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');

  const getVoices = async () => {
    const voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length) {
        resolve(voices);
      }
      speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
    });
    setVoices(voices);
  };

  useEffect(() => {
    getVoices();
  }, []);

  const speak = async (text: string, config?: SpeakConfig) => {
    const speech = new SpeechSynthesisUtterance(text);
    const lang = config?.lang || navigator.language || 'en-US';

    speech.voice = (voices.filter((v) => v.lang === lang) || voices)[0];
    speech.rate = config?.rate || 0.8;

    return new Promise<SpeechSynthesisUtterance>((resolve) => {
      speech.onend = () => resolve(speech);
      speechSynthesis.speak(speech);
    });
  };

  const listen = (config: ListenConfig): void => {
    console.log(config);
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = config.lang || navigator.language || 'en-US';

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const isFinal = result.isFinal;
        const transcript = result[0].transcript;

        if (isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setResult({ transcript: finalTranscript || interimTranscript, isFinal: false });
      setFinalTranscript(finalTranscript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();

    setSpeechRecognition(recognition);
  };

  const stopListening = (): void => {
    speechRecognition?.stop();
  };

  return {
    speak,
    listen,
    listening,
    transcript: result.transcript,
    finalTranscript,
    stopListening,
  };
};

export default useVoice;
