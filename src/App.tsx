import { ConversationChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { BufferMemory } from 'langchain/memory';

import ChatPage from './pages/chat-page';

function App() {
  const model = new OpenAI({
    openAIApiKey: '',
    temperature: 0.4,
  });
  const memory = new BufferMemory();
  const chain = new ConversationChain({ llm: model, memory });

  return (
    <main>
      <ChatPage chain={chain} />
    </main>
  );
}

export default App;
