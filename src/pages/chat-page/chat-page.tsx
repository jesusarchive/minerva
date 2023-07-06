import { ConversationChain } from 'langchain/chains';
import React, { useEffect, useState } from 'react';

import { COMMAND, COMMAND_PREFIX, FEED_ELEMENT_TYPE, MODE } from './constants';
import Feed from './feed';
import {
  aiUser,
  channel,
  chatWindow,
  generateFeedElement,
  getTimeString,
  network,
  newUser,
} from './helpers';
import StatusBar from './status-bar';
import { FeedType, UserType } from './types';

type ChatPageProps = {
  chain: ConversationChain;
};

export default function ChatPage({ chain }: ChatPageProps) {
  const [user, setUser] = useState<UserType>(newUser);
  const [feed, setFeed] = useState<FeedType>([]);
  const [userInput, setUserInput] = useState<string>('');
  const clock = getTimeString();

  const init = () => {
    const feedElement = generateFeedElement({
      type: FEED_ELEMENT_TYPE.STATUS,
      message: `${user.nick} has joined #${channel.name}`,
    });
    setFeed([feedElement]);
  };

  const interact = async (message: string) => {
    const data = await chain.call({ input: message });

    const feedElement = generateFeedElement({
      type: FEED_ELEMENT_TYPE.MESSAGE,
      user: aiUser,
      message: data.response,
    });

    setFeed([...feed, feedElement]);
  };

  const handleFeedChange = async () => {
    // interact with AI when user sends a message
    const lastFeedEl = feed[feed.length - 1];
    const isUserMessage =
      lastFeedEl &&
      lastFeedEl?.type === FEED_ELEMENT_TYPE.MESSAGE &&
      lastFeedEl?.user?.mode !== MODE.AI;

    if (isUserMessage) {
      await interact(lastFeedEl.message);
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
      message: `${user.nick} is now known as ${nick}`,
    });
    setUser({ ...user, nick });
    setFeed([...feed, feedElement]);
  };

  const handleClearCommand = () => {
    // ! provisional, split feed into raw and processed
    setFeed([]);
  };

  const handleHelpCommand = () => {
    const feedElement = {
      date: new Date(),
      type: FEED_ELEMENT_TYPE.STATUS,
      message: `Available commands: ${Object.values(COMMAND).join(', ')}`,
    };
    setFeed([...feed, feedElement]);
  };

  const handleInfoCommand = () => {
    const feedElement = {
      date: new Date(),
      type: FEED_ELEMENT_TYPE.STATUS,
      message: `User: ${user.nick}(${user.mode})`,
    };
    setFeed([...feed, feedElement]);
  };

  const handleMotdCommand = () => {
    const feedElement = {
      date: new Date(),
      type: FEED_ELEMENT_TYPE.STATUS,
      message: `Welcome to Minerva chat!`,
    };
    setFeed([...feed, feedElement]);
  };

  const handleRawLogCommand = () => {
    // downloads raw log of all messages
    const feedElement = {
      date: new Date(),
      type: FEED_ELEMENT_TYPE.STATUS,
      message: `Raw log downloaded`,
    };
    setFeed([...feed, feedElement]);
  };

  const handleRestartCommand = () => {
    // restarts langchain interaction
    const feedElement = {
      date: new Date(),
      type: FEED_ELEMENT_TYPE.STATUS,
      message: `Restarting langchain interaction`,
    };
    setFeed([...feed, feedElement]);
  };

  const handleTopicCommand = () => {};

  const handleVoiceCommand = () => {};

  const handleQuitCommand = () => {
    // quits chat
    const feedElement = {
      date: new Date(),
      type: FEED_ELEMENT_TYPE.STATUS,
      message: `Quitting chat`,
    };
    setFeed([...feed, feedElement]);
  };

  const commandHandlers = {
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
    const handler = commandHandlers[formattedCommand];

    if (handler) {
      handler?.(command);
    } else {
      const feedElement = generateFeedElement({
        type: FEED_ELEMENT_TYPE.STATUS,
        message: `Command not found`,
      });
      setFeed([...feed, feedElement]);
    }

    clearUserInput();
  };

  const handleUserMessage = (message: string) => {
    const feedElement = generateFeedElement({
      type: FEED_ELEMENT_TYPE.MESSAGE,
      user,
      message,
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
      handleUserMessage(userInput);

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

      {/* ACTIVE WINDOW INDICATOR */}
      <div className="flex space-x-2">
        <span>{`[#${channel.name}]`}</span>
        <form className="w-full" onSubmit={handleUserInputSubmit}>
          <input
            className="bg-inherit border-0 w-full"
            type="text"
            value={userInput}
            onChange={handleUserInputChange}
          />
        </form>
      </div>
    </article>
  );
}
