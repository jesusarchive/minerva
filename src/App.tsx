/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import Feed from './components/feed';
import StatusBar from './components/status-bar';
import { aiUser, channel, chatWindow, network, newUser, statusMessage } from './data/config';
import {
  COMMAND,
  COMMAND_PREFIX,
  FEED_ELEMENT_TYPE,
  USER_TYPE,
  VOICE_COMMAND,
} from './data/constants';
import useAi from './hooks/use-ai';
import useFeed from './hooks/use-feed';
import useVoice from './hooks/use-voice';
import { UserType } from './types';
import { downloadRawLog, getTimeString } from './utils';

export default function App() {
  const { chain } = useAi();
  const {
    feed,
    rawFeed,
    addFeedElement,
    addFeedStatusElement,
    clearFeed,
    generateFeedMessageElement,
  } = useFeed();
  const { speak } = useVoice();
  const clock = getTimeString();
  const [user, setUser] = useState<UserType>(newUser);
  const [userInput, setUserInput] = useState<string>('');
  const [voiceActive, setVoiceActive] = useState<boolean>(false);

  const welcome = () => {
    addFeedStatusElement(statusMessage.welcome);
  };

  const init = () => {
    clearFeed();
    welcome();
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

  // COMMAND HANDLERS
  const changeNick = (command: string) => {
    const nick = command.split(' ')[1];
    setUser({ ...user, nick });
    const feedbackText = `${user.nick} is now known as ${nick}`;
    addFeedStatusElement(feedbackText);
  };

  const help = () => {
    addFeedStatusElement(statusMessage.help);
  };

  const info = () => {
    addFeedStatusElement(statusMessage.info);
  };

  const rawLog = () => {
    downloadRawLog(rawFeed);
    addFeedStatusElement(statusMessage.rawLogDownloaded);
  };

  const topic = () => {
    // TODO
  };

  const commandNotFound = (fullCommand: string) => {
    const feedbackText = `${statusMessage.commandNotFound}: ${fullCommand}`;
    addFeedStatusElement(feedbackText);
  };

  const activateVoice = (args: string) => {
    setVoiceActive(true);
    const feedbackText = `${statusMessage.voiceActive} ${args}`;
    addFeedStatusElement(feedbackText);
    // TODO: update modes to voice
    // Differentiate between user and channel modes, when channel mode is voice we use the speak function, when user mode is voice we use the listen function for voice recognition
  };

  const deactivateVoice = (args: string) => {
    setVoiceActive(false);
    const feedbackText = `${statusMessage.voiceActive} ${args}`;
    addFeedStatusElement(feedbackText);
    // TODO: update modes to voice
  };

  const voiceCommandFns = {
    [VOICE_COMMAND.ON]: activateVoice,
    [VOICE_COMMAND.OFF]: deactivateVoice,
  };

  const voice = (fullCommand: string) => {
    const args = fullCommand.split(' ')[1].toUpperCase();
    const voiceCommandFn = voiceCommandFns[args];
    if (voiceCommandFn) {
      voiceCommandFn(args);
      // TODO: extend for other voice commands like volume, speed, etc.
      const feedbackText = `${statusMessage.voiceActive} ${args}`;
      addFeedStatusElement(feedbackText);
    } else {
      commandNotFound(fullCommand);
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
    [COMMAND.MOTD]: welcome,
    [COMMAND.NICK]: changeNick,
    [COMMAND.RAWLOG]: rawLog,
    [COMMAND.RESTART]: window.location.reload,
    [COMMAND.TOPIC]: topic,
    [COMMAND.VOICE]: voice,
    [COMMAND.QUIT]: quit,
  };

  // USER INPUT HANDLERS
  const handleUserCommand = (fullCommand: string) => {
    // get command name and remove prefix (/)
    const commandName = fullCommand.split(' ')[0].slice(1).toUpperCase();
    const commandFn = commandFns[commandName];
    if (commandFn) {
      // TODO: Review passing parameters if the function does not need them
      commandFn(fullCommand);
    } else {
      commandNotFound(fullCommand);
    }
    clearUserInput();
  };

  const handleUserText = (text: string) => {
    const feedElement = generateFeedMessageElement({
      user,
      text,
    });
    addFeedElement(feedElement);
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
