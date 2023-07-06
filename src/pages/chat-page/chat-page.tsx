import { ConversationChain } from 'langchain/chains';
import React, { useEffect, useState } from 'react';

import { FEED_ELEMENT_TYPE, MODE } from './constants';
import Feed from './feed';
import { aiUser, channel, chatWindow, getTimeString, network, newUser } from './helpers';
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
    const feedElement = {
      date: new Date(),
      type: FEED_ELEMENT_TYPE.STATUS,
      message: `${user.nick} has joined #${channel.name}`,
    };
    setFeed([feedElement]);
  };

  // OPENAI
  const interact = async (message: string) => {
    const data = await chain.call({ input: message });

    const aiFeed = {
      date: new Date(),
      type: FEED_ELEMENT_TYPE.MESSAGE,
      user: aiUser,
      message: data.response,
    };

    setFeed([...feed, aiFeed]);
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

  const handleUserCommand = (command: string) => {
    // change user nick
    if (command.startsWith('/NICK')) {
      const nick = command.split(' ')[1];
      const feedElement = {
        date: new Date(),
        type: FEED_ELEMENT_TYPE.STATUS,
        message: `${user.nick} is now known as ${nick}`,
      };
      setUser({ ...user, nick });
      setFeed([...feed, feedElement]);
    }

    clearUserInput();
  };

  const handleUserMessage = (message: string) => {
    const userFeed = {
      date: new Date(),
      type: FEED_ELEMENT_TYPE.MESSAGE,
      user,
      message,
    };
    setFeed([...feed, userFeed]);
    setUserInput('');
    clearUserInput();
  };

  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleUserInputSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isCommand = userInput && userInput.startsWith('/');
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

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    handleFeedChange();
  }, [feed]);

  return (
    <article className="flex flex-col h-screen w-full bg-white dark:bg-black dark:text-white font-mono">
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
      <div>
        <form onSubmit={handleUserInputSubmit}>
          <div className="flex space-x-2">
            <span>{`[#${channel.name}]`}</span>
            <input
              className="bg-inherit border-0 w-full"
              type="text"
              value={userInput}
              onChange={handleUserInputChange}
            />
          </div>
        </form>
      </div>
    </article>
  );
}
