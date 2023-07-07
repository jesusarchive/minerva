import { DEFAULT_USER_NICK, MINERVA, MODE } from './constants';
import { FeedElementType } from './types';

// HELPER FUNCTIONS
export function getTimeString(date = new Date()): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function generateFeedElement({
  ...feedElement
}: Omit<FeedElementType, 'id' | 'date'>): FeedElementType {
  return {
    id: generateRandomId(),
    date: new Date(),
    ...feedElement,
  };
}

export function downloadRawLog(data: unknown) {
  const filename = 'data.json';

  const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const jsonUrl = URL.createObjectURL(jsonBlob);

  const link = document.createElement('a');
  link.download = filename;
  link.href = jsonUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// CHAT PAGE DATA WITH MOCKS
export const newUser = {
  nick: DEFAULT_USER_NICK,
  mode: MODE.NORMAL,
};
export const aiUser = {
  nick: MINERVA,
  mode: MODE.AI,
};
export const chatWindow = {
  id: 1,
  topic: 'Minerva chat v0.0.1 - localhost',
};
export const network = {
  tag: 'localhost',
};
export const channel = {
  name: 'chat',
  mode: MODE.NORMAL,
};
export const statusMessage = {
  welcome: `Welcome! I'm Minerva, an AI chat application. I'm here to help you with any questions you may have. I'm excited to get to know you and hear what you have to say. Let's make this a great conversation!`,
  error: 'Sorry, I did not understand that. Could you please rephrase?',
  goodbye: 'Goodbye! I hope to see you again soon.',
  commandNotFound: 'Command not found.',
};
