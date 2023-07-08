import { ConversationChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { BufferMemory } from 'langchain/memory';
import { useEffect, useState } from 'react';

import { defaultAiTemperature } from '@/data/config';

export default function useAi(temperature = defaultAiTemperature) {
  const [chain, setChain] = useState<ConversationChain | null>(null);

  useEffect(() => {
    const model = new OpenAI({
      openAIApiKey: '',
      temperature,
    });
    const memory = new BufferMemory();
    const conversationChain = new ConversationChain({ llm: model, memory });

    setChain(conversationChain);
  }, [temperature]);

  return { chain };
}
