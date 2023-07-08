import { statusMessage } from '@/data/config';
import { COMMAND, MODE, VOICE_COMMAND } from '@/data/constants';
import { FeedType, ModeType } from '@/types';
import { downloadRawLog } from '@/utils';

type UseCommandsProps = {
  // feed
  rawFeed: FeedType;
  clearFeed: () => void;
  addFeedStatusElement: (text: string) => void;
  // user
  setUserNick: (nick: string) => void;
  // channel
  setChannelName: (name: string) => void;
  setChannelTopic: (topic: string) => void;
  setChannelMode: (mode: ModeType) => void;
  // voice
  activateVoice: () => void;
  deactivateVoice: () => void;
};

export default function useCommands({
  rawFeed,
  clearFeed,
  setUserNick,
  setChannelName,
  setChannelTopic,
  setChannelMode,
  addFeedStatusElement,
  activateVoice,
  deactivateVoice,
}: UseCommandsProps) {
  const isCommand = (text = '') => text.startsWith('/');

  const motd = () => addFeedStatusElement(statusMessage.welcome);

  const help = () => addFeedStatusElement(statusMessage.help);

  const info = () => addFeedStatusElement(statusMessage.info);

  const rawLog = () => {
    downloadRawLog(rawFeed);
    addFeedStatusElement(statusMessage.rawLogDownloaded);
  };

  const commandNotFound = () => {
    const feedbackText = statusMessage.commandNotFound;
    addFeedStatusElement(feedbackText);
  };

  const voiceCommandFns = {
    [VOICE_COMMAND.ON]: () => {
      activateVoice();
      setChannelMode(MODE.VOICE);
    },
    [VOICE_COMMAND.OFF]: () => {
      deactivateVoice();
      setChannelMode(MODE.TEXT);
    },
  };

  const voice = (args: string[]) => {
    const voiceCommandFn = voiceCommandFns[args[0].toUpperCase()];

    if (voiceCommandFn) {
      voiceCommandFn();
      // TODO: extend for other voice commands like volume, speed, etc.
      const feedbackText = `${statusMessage.voiceActive} ${args[0]}`;
      addFeedStatusElement(feedbackText);
    } else {
      commandNotFound();
    }
  };

  const quit = () => {
    // TODO: add some functionality to quit
    addFeedStatusElement(statusMessage.goodbye);
  };

  const commandFns = {
    [COMMAND.CLEAR]: clearFeed,
    [COMMAND.HELP]: help,
    [COMMAND.INFO]: info,
    [COMMAND.MOTD]: motd,
    [COMMAND.NICK]: (args: string[]) => setUserNick(args[0]),
    [COMMAND.RAWLOG]: rawLog,
    [COMMAND.RESTART]: () => window.location.reload(),
    [COMMAND.TOPIC]: (args: string[]) => setChannelTopic(args[0]),
    [COMMAND.VOICE]: voice,
    [COMMAND.QUIT]: quit,
  };

  const executeCommand = (fullCommand: string) => {
    const [commandName, ...args] = fullCommand.split(' ');
    // remove prefix
    const formattedCommandName = commandName.slice(1).toUpperCase();
    const commandFn = commandFns[formattedCommandName];

    if (commandFn) {
      commandFn(args);
    } else {
      commandNotFound();
    }
  };

  return { executeCommand, isCommand };
}
