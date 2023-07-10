export enum FEED_ELEMENT_TYPE {
  STATUS = 'STATUS',
  MESSAGE = 'MESSAGE',
}

export enum USER_TYPE {
  USER = 'USER',
  AI = 'AI',
}

export enum MODE {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
}

export const COMMAND_PREFIX = '/';

export enum COMMAND {
  CLEAR = 'CLEAR',
  HELP = 'HELP',
  INFO = 'INFO',
  NICK = 'NICK',
  MOTD = 'MOTD',
  RAWLOG = 'RAWLOG',
  RESTART = 'RESTART',
  TOPIC = 'TOPIC',
  VOICE = 'VOICE',
  QUIT = 'QUIT',
}

export enum VOICE_COMMAND {
  ON = 'ON',
  OFF = 'OFF',
}
