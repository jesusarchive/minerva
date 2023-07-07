import React, { useEffect, useState } from 'react';

import useAi from '../../hooks/use-ai';
import useVoice from '../../hooks/use-voice';
import { COMMAND, COMMAND_PREFIX, FEED_ELEMENT_TYPE, MODE, VOICE_COMMAND } from './constants';
import Feed from './feed';
import {
  aiUser,
  channel,
  chatWindow,
  downloadRawLog,
  generateFeedElement,
  getTimeString,
  network,
  newUser,
  statusMessage,
} from './helpers';
import StatusBar from './status-bar';
import { FeedType, UserType } from './types';

export default function ChatPage() {
  const ai = useAi();
  const { speak } = useVoice();
  const [user, setUser] = useState<UserType>(newUser);
  const [feed, setFeed] = useState<FeedType>([]);
  const [userInput, setUserInput] = useState<string>('');
  const clock = getTimeString();
  const [voiceActive, setVoiceActive] = useState<boolean>(false);

  const init = () => {
    const initialFeed = [
      generateFeedElement({
        type: FEED_ELEMENT_TYPE.STATUS,
        text: statusMessage.welcome,
      }),
    ];
    setFeed(initialFeed);
  };

  const interact = async (message: string) => {
    if (!ai) {
      return;
    }

    const data = await ai.call({ input: message });

    const feedElement = generateFeedElement({
      type: FEED_ELEMENT_TYPE.MESSAGE,
      user: aiUser,
      text: data.response,
    });

    setFeed([...feed, feedElement]);

    if (voiceActive) {
      speak(data.response);
    }
  };

  const handleFeedChange = async () => {
    // interact with AI when user sends a message
    const lastFeedEl = feed[feed.length - 1];
    const isUserMessage =
      lastFeedEl &&
      lastFeedEl?.type === FEED_ELEMENT_TYPE.MESSAGE &&
      lastFeedEl?.user?.mode !== MODE.AI;

    if (isUserMessage) {
      await interact(lastFeedEl.text);
    }
  };

  const clearUserInput = () => {
    setUserInput('');
  };

  // COMMAND HANDLERS
  const handleNickCommand = (command: string) => {
    const nick = command.split(' ')[1];
    const feedElement = generateFeedElement({
      type: FEED_ELEMENT_TYPE.STATUS,
      text: `${user.nick} is now known as ${nick}`,
    });
    setUser({ ...user, nick });
    setFeed([...feed, feedElement]);
  };

  const handleClearCommand = () => {
    // ! provisional, split feed into raw and processed
    setFeed([]);
  };

  const handleHelpCommand = () => {
    const feedElement = generateFeedElement({
      type: FEED_ELEMENT_TYPE.STATUS,
      text: `Available commands: ${Object.values(COMMAND).join(', ')}`,
    });
    setFeed([...feed, feedElement]);
  };

  const handleInfoCommand = () => {
    const feedElement = generateFeedElement({
      type: FEED_ELEMENT_TYPE.STATUS,
      text: "Minerva is an AI chatbot that you can talk to developed with GPT-3's Davinci engine.",
    });
    setFeed([...feed, feedElement]);
  };

  const handleMotdCommand = () => {
    // shows welcome message
    const feedElement = generateFeedElement({
      type: FEED_ELEMENT_TYPE.STATUS,
      text: statusMessage.welcome,
    });
    setFeed([...feed, feedElement]);
  };

  const handleRawLogCommand = () => {
    downloadRawLog(feed);
    const feedElement = generateFeedElement({
      type: FEED_ELEMENT_TYPE.STATUS,
      text: 'Raw log downloaded.',
    });
    setFeed([...feed, feedElement]);
  };

  const handleRestartCommand = () => {
    window.location.reload();
  };

  const handleTopicCommand = () => {};

  const voiceCommandHandler = {
    [VOICE_COMMAND.ON]: () => setVoiceActive(true),
    [VOICE_COMMAND.OFF]: () => setVoiceActive(false),
  };

  const handleVoiceCommand = (command: string) => {
    const voiceStatus = command.split(' ')[1];
    if (!voiceCommandHandler[voiceStatus]) {
      // TODO: Add command not found
      return;
    }

    voiceCommandHandler[voiceStatus]();
    const feedElement = generateFeedElement({
      type: FEED_ELEMENT_TYPE.STATUS,
      text: `Voice is now ${voiceStatus}`,
    });
    setFeed([...feed, feedElement]);
  };

  const handleQuitCommand = () => {
    const feedElement = generateFeedElement({
      type: FEED_ELEMENT_TYPE.STATUS,
      text: statusMessage.goodbye,
    });
    setFeed([...feed, feedElement]);
  };

  const commandHandler = {
    [COMMAND.CLEAR]: handleClearCommand,
    [COMMAND.HELP]: handleHelpCommand,
    [COMMAND.INFO]: handleInfoCommand,
    [COMMAND.MOTD]: handleMotdCommand,
    [COMMAND.NICK]: handleNickCommand,
    [COMMAND.RAWLOG]: handleRawLogCommand,
    [COMMAND.RESTART]: handleRestartCommand,
    [COMMAND.TOPIC]: handleTopicCommand,
    [COMMAND.VOICE]: handleVoiceCommand,
    [COMMAND.QUIT]: handleQuitCommand,
  };

  // USER INPUT HANDLERS
  const handleUserCommand = (command: string) => {
    const formattedCommand = command.toUpperCase().split(' ')[0].slice(1);
    const handler = commandHandler[formattedCommand];

    if (handler) {
      handler?.(command);
    } else {
      const feedElement = generateFeedElement({
        type: FEED_ELEMENT_TYPE.STATUS,
        text: `Command not found`,
      });
      setFeed([...feed, feedElement]);
    }

    clearUserInput();
  };

  const handleUserText = (text: string) => {
    const feedElement = generateFeedElement({
      type: FEED_ELEMENT_TYPE.MESSAGE,
      user,
      text,
    });

    setFeed([...feed, feedElement]);
    clearUserInput();
  };

  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleUserInputSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isCommand = userInput && userInput.startsWith(COMMAND_PREFIX);
    const isMessage = userInput && !isCommand;

    if (isCommand) {
      handleUserCommand(userInput);

      return;
    }

    if (isMessage) {
      handleUserText(userInput);

      return;
    }
  };

  // EFFECTS
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    handleFeedChange();
  }, [feed]);

  return (
    <article className="h-screen w-full flex flex-col bg-white dark:bg-black dark:text-white font-mono">
      {/* ROOT STATUS BAR */}
      <StatusBar>
        <span>{chatWindow.topic}</span>
      </StatusBar>

      {/* AREA SHOWING CHAT AND STATUS MESSAGES */}
      <div className="flex-grow overflow-auto">
        <Feed feed={feed} />
      </div>

      {/* WINDOW STATUS BAR */}
      <StatusBar>
        <StatusBar.Block>
          <span>{clock}</span>
        </StatusBar.Block>

        <StatusBar.Block>
          <span>{`${user.nick}(${user.mode})`}</span>
        </StatusBar.Block>

        <StatusBar.Block>
          <span>{`${chatWindow.id}:${network.tag}/#${channel.name}(${channel.mode})`}</span>
        </StatusBar.Block>
      </StatusBar>

      {/* USER INPUT */}
      <div className="flex space-x-2">
        <span>{`[#${channel.name}]`}</span>
        <form className="w-full" onSubmit={handleUserInputSubmit}>
          <input
            className="bg-inherit border-0 w-full"
            autoFocus
            type="text"
            value={userInput}
            onChange={handleUserInputChange}
          />
        </form>
      </div>
    </article>
  );
}
