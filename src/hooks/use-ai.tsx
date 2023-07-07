import { ConversationChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { BufferMemory } from 'langchain/memory';
import { useEffect, useState } from 'react';

export const DEFAULT_AI_TEMPERATURE = 0.7;

export default function useAi(temperature = DEFAULT_AI_TEMPERATURE) {
  const [ai, setAi] = useState<ConversationChain | null>(null);

  useEffect(() => {
    const model = new OpenAI({
      openAIApiKey: '',
      temperature,
    });
    const memory = new BufferMemory();
    const chain = new ConversationChain({ llm: model, memory });

    setAi(chain);
  }, [temperature]);

  return ai;
}
