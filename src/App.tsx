/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import Feed from './components/feed';
import StatusBar from './components/status-bar';
import { aiUser, channel, chatWindow, network, newUser, statusMessage } from './data/config';
import { COMMAND, COMMAND_PREFIX, FEED_ELEMENT_TYPE, MODE, VOICE_COMMAND } from './data/constants';
import useAi from './hooks/use-ai';
import useFeed from './hooks/use-feed';
import useVoice from './hooks/use-voice';
import { UserType } from './types';
import { downloadRawLog, getTimeString } from './utils';

export default function App() {
  const ai = useAi();
  const {
    feed,
    rawFeed,
    addFeedElement,
    clearFeed,
    generateFeedMessageElement,
    generateFeedStatusElement,
  } = useFeed();
  const { speak } = useVoice();
  const [user, setUser] = useState<UserType>(newUser);
  const [userInput, setUserInput] = useState<string>('');
  const clock = getTimeString();
  const [voiceActive, setVoiceActive] = useState<boolean>(false);

  const welcome = () => {
    const feedbackText = statusMessage.welcome;
    const feedElement = generateFeedStatusElement(feedbackText);
    addFeedElement(feedElement);
  };

  const init = () => {
    clearFeed();
    welcome();
  };

  const interact = async (message: string) => {
    if (ai) {
      const data = await ai.call({ input: message });
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
      lastFeedEl?.user?.mode !== MODE.AI;

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
    const feedbackText = `${user.nick} is now known as ${nick}`;
    const feedbackElement = generateFeedStatusElement(feedbackText);
    setUser({ ...user, nick });
    addFeedElement(feedbackElement);
  };

  const help = () => {
    const feedbackText = `Available commands: ${Object.values(COMMAND).join(', ')}`;
    const feedElement = generateFeedStatusElement(feedbackText);
    addFeedElement(feedElement);
  };

  const info = () => {
    const feedbackText =
      "Minerva is an AI chatbot that you can talk to developed with GPT-3's Davinci engine.";
    const feedElement = generateFeedStatusElement(feedbackText);
    addFeedElement(feedElement);
  };

  const rawLog = () => {
    downloadRawLog(rawFeed);
    const feedbackText = 'Raw log downloaded.';
    const feedElement = generateFeedStatusElement(feedbackText);
    addFeedElement(feedElement);
  };

  const topic = () => {
    // TODO
  };

  const voiceCommandHandler = {
    [VOICE_COMMAND.ON]: () => setVoiceActive(true),
    [VOICE_COMMAND.OFF]: () => setVoiceActive(false),
  };

  const voice = (command: string) => {
    const voiceCommand = command.split(' ')[1].toUpperCase();
    const handler = voiceCommandHandler[voiceCommand];
    if (!handler) {
      // TODO: Add command not found
      return;
    }
    voiceCommandHandler[voiceCommand]();
    // TODO: extend for other voice commands like volume, speed, etc.
    const feedbackText = `Voice is now ${voiceCommand}`;
    const feedElement = generateFeedStatusElement(feedbackText);
    addFeedElement(feedElement);
  };

  const quit = () => {
    // TODO: add some functionality to quit
    const feedbackText = statusMessage.goodbye;
    const feedElement = generateFeedStatusElement(feedbackText);
    addFeedElement(feedElement);
  };

  const commandHandler = {
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
  const commandNotFound = (command: string) => {
    const feedbackText = `Command not found: ${command}`;
    const feedElement = generateFeedStatusElement(feedbackText);
    addFeedElement(feedElement);
  };

  const handleUserCommand = (command: string) => {
    const formattedCommand = command.toUpperCase().split(' ')[0].slice(1);
    const handler = commandHandler[formattedCommand];
    if (handler) {
      handler(command);
    } else {
      commandNotFound(command);
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
