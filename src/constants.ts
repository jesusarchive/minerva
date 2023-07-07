export const FEED_ELEMENT_TYPE = {
  STATUS: 'STATUS',
  MESSAGE: 'MESSAGE',
} as const;

// User and channel modes
// For now is only used to differentiate between normal users and AI users
export const MODE = {
  NORMAL: 'NORMAL',
  AI: 'AI',
} as const;

// COMMANDS
export const COMMAND_PREFIX = '/';

// Available commands
export const COMMAND = {
  // Scrolls up the text in the window and fills the window with blank lines; you may want to use this to make new text start at the top of the window again.
  CLEAR: 'CLEAR',
  // Shows the list of commands
  HELP: 'HELP',
  // Displays information about the software
  INFO: 'INFO',
  // Changes your nickname
  NICK: 'NICK',
  // Displays the welcome message
  MOTD: 'MOTD',
  // Saves all the raw data that is received into a log file.
  RAWLOG: 'RAWLOG',
  // Restarts the chat
  RESTART: 'RESTART',
  // Displays or modifies the topic of a channel
  TOPIC: 'TOPIC',
  // Activates or deactivates the voice mode
  VOICE: 'VOICE',
  // Terminates the application
  QUIT: 'QUIT',
};

// Voice commands
export const VOICE_COMMAND = {
  // Activates the voice mode
  ON: 'ON',
  // Deactivates the voice mode
  OFF: 'OFF',
};

export const MINERVA = 'Minerva';
export const DEFAULT_USER_NICK = 'Anonymous';
