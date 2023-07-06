import { DEFAULT_USER_NICK, MINERVA, MODE } from './constants';

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
  topic: 'Welcome to Minerva chat',
};
export const network = {
  tag: 'localhost',
};
export const channel = {
  name: 'chat',
  mode: MODE.NORMAL,
};

// HELPER FUNCTIONS
export function getTimeString(date = new Date()): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
