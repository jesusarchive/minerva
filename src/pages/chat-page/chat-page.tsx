import React, { useEffect, useState } from 'react';

import Feed from './feed';
import StatusBar from './status-bar';
import { FeedType } from './types';

export default function ChatPage() {
  const [feed, setFeed] = useState<FeedType>([]);
  const [message, setMessage] = useState<string>('');
  const clock = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  // ! MOCK DATA
  const user = {
    nick: 'user',
    mode: 'userMode',
  };
  const window = {
    id: 1,
    topic: 'Welcome to Minerva chat',
  };
  const network = {
    tag: 'network',
  };
  const channel = {
    name: 'chat',
    mode: 'channelMode',
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message) {
      // TODO: differentiate between commands and messages, commands start with /
      const element = {
        date: new Date(),
        user,
        message,
      };
      setFeed([...feed, element]);
      setMessage('');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    const FeedElement = {
      date: new Date(),
      status: true,
      message: `user has joined #${channel.name}`,
    };
    setFeed([...feed, FeedElement]);
  }, []);

  return (
    <article className="flex flex-col h-screen w-full bg-white dark:bg-black dark:text-white font-mono">
      {/* ROOT STATUS BAR */}
      <StatusBar>
        <span>{window.topic}</span>
      </StatusBar>

      {/* AREA SHOWING CHAT AND STATUS MESSAGES */}
      <div className="flex-grow overflow-auto">
        <Feed feed={feed} />
      </div>

      {/* BOTTOM */}
      <div>
        {/* WINDOW STATUS BAR */}
        <StatusBar>
          <StatusBar.Block>
            <span>{clock}</span>
          </StatusBar.Block>

          <StatusBar.Block>
            <span>{`${user.nick}(${user.mode})`}</span>
          </StatusBar.Block>

          <StatusBar.Block>
            <span>{`${window.id}:${network.tag}/#${channel.name}(${channel.mode})`}</span>
          </StatusBar.Block>
        </StatusBar>

        {/* ACTIVE WINDOW INDICATOR */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="flex space-x-2">
              <span>{`[#${channel.name}]`}</span>
              <input
                className="bg-inherit border-0 w-full"
                type="text"
                value={message}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
      </div>
    </article>
  );
}
