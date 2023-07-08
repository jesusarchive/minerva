import { MODE } from './constants';

export const minerva = 'Minerva';

export const defaultUserNick = 'Anonymous';

export const defaultAiTemperature = 0.7;

export const newUser = {
  nick: defaultUserNick,
  mode: MODE.NORMAL,
};

export const aiUser = {
  nick: minerva,
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
