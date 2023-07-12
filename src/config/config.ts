import { COMMAND, COMMAND_PREFIX, MODE, USER_TYPE } from './constants';

export const minerva = 'Minerva';

export const defaultUserNick = 'Anonymous';

export const defaultAiTemperature = 0.7;

export const newUser = {
  type: USER_TYPE.USER,
  nick: defaultUserNick,
  mode: MODE.TEXT,
};

export const aiUser = {
  type: USER_TYPE.AI,
  nick: minerva,
};

export const chatWindow = {
  id: 1,
};

export const network = {
  tag: 'localhost',
};

export const channel = {
  name: 'chat',
  mode: MODE.TEXT,
  topic: 'The robots are taking over!',
};

export const statusMessage = {
  welcome: `Welcome! I'm Minerva, an AI chat application. I'm here to help you with any questions you may have. I'm excited to get to know you and hear what you have to say. Let's make this a great conversation!`,
  error: 'Sorry, I did not understand that. Could you please rephrase?',
  goodbye: 'Goodbye! I hope to see you again soon.',
  commandNotFound: 'Command not found.',
  info: "Minerva is an AI chatbot that you can talk to developed with GPT-3's Davinci engine.",
  help: `Available commands: ${Object.values(COMMAND)
    .map((command) => `${COMMAND_PREFIX}${command}`)
    .join(', ')}`,
  rawLogDownloaded: 'Raw log downloaded.',
  voiceActive: 'Voice is now',
};
