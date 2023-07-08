/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import Feed from './components/feed';
import StatusBar from './components/status-bar';
import { aiUser, chatWindow, network } from './data/config';
import { COMMAND, COMMAND_PREFIX, FEED_ELEMENT_TYPE, USER_TYPE } from './data/constants';
import useAi from './hooks/use-ai';
import useChannel from './hooks/use-channel';
import useCommands from './hooks/use-commands';
import useFeed from './hooks/use-feed';
import useUser from './hooks/use-user';
import useVoice from './hooks/use-voice';
import { getTimeString } from './utils';

export default function App() {
  const { chain } = useAi();
  const { feed, addFeedElement, generateFeedMessageElement, ...feedHelpers } = useFeed();
  const { addFeedStatusElement } = feedHelpers;
  const { voiceActive, speak, ...voiceHelpers } = useVoice({ addFeedStatusElement });
  const { channel, ...channelHelpers } = useChannel({
    addFeedStatusElement,
  });
  const { user, ...userHelpers } = useUser({ addFeedStatusElement });
  const { isCommand, executeCommand } = useCommands({
    ...feedHelpers,
    ...userHelpers,
    ...channelHelpers,
    ...voiceHelpers,
  });
  const clock = getTimeString();
  const [userInput, setUserInput] = useState<string>('');

  const init = () => {
    // TODO: Review not clearing feed on rerender
    executeCommand(`${COMMAND_PREFIX}${COMMAND.CLEAR}`);
    // show welcome message
    executeCommand(`${COMMAND_PREFIX}${COMMAND.MOTD}`);
  };

  const interact = async (message: string) => {
    if (chain) {
      const data = await chain.call({ input: message });
      const feedElement = generateFeedMessageElement({
        user: aiUser,
        text: data.response,
      });

      addFeedElement(feedElement);

      if (voiceActive) {
        speak(data.response);
      }
    }
  };

  const handleFeedChange = async () => {
    // interact with AI when user sends a message
    const lastFeedEl = feed[feed.length - 1];
    const isUserMessage =
      lastFeedEl &&
      lastFeedEl?.type === FEED_ELEMENT_TYPE.MESSAGE &&
      lastFeedEl?.user?.type === USER_TYPE.USER;

    if (isUserMessage) {
      await interact(lastFeedEl.text);
    }
  };

  const clearUserInput = () => {
    setUserInput('');
  };

  const handleUserText = (text: string) => {
    const feedElement = generateFeedMessageElement({
      user,
      text,
    });
    addFeedElement(feedElement);
  };

  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleUserInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userInput) {
      if (isCommand(userInput)) {
        executeCommand(userInput);
      } else {
        handleUserText(userInput);
      }
      clearUserInput();
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
        <span>{channel.topic}</span>
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
            className="bg-inherit w-full caret-pink-500"
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
