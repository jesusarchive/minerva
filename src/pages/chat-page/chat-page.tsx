import React, { useState } from 'react';

type FeedElement = {
  date: Date;
  status?: boolean;
  user?: string;
  message: string;
};

type Feed = FeedElement[];

export default function ChatPage() {
  const [feed, setFeed] = useState<Feed>([
    { date: new Date(), status: true, message: 'Minerva has joined' },
  ]);
  const [message, setMessage] = useState<string>('');
  const user = 'user';

  // * root status bar
  // topic of active window
  const topicOfActiveWindow = 'Welcome to Minerva chat';

  // * window status bar
  // block 1
  // clock
  const clock = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  // block 2
  // user nickname
  const nick = user;
  // user mode on the server
  const userModeOnServer = 'userMode';
  // block 3
  // window number
  const windowNumber = 1;
  // network tag
  const networkTag = 'network';
  // channel name
  const channelName = 'chat';
  // channel mode
  const channelMode = 'channelMode';
  // shows numbers of window with new text/messages
  const activityIndicator = 1;

  // * active window indicator
  // your text will be sent here
  // write text and commands here in the input line and send them with Enter
  // chat
  // const channelName = 'chat';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const element = {
      date: new Date(),
      user,
      message,
    };
    setFeed([...feed, element]);
    setMessage('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return (
    <article className="flex flex-col h-screen bg-white dark:bg-black dark:text-white font-mono">
      {/* ROOT STATUS BAR */}
      <div className="bg-blue-700 text-white pl-2">
        <span>{topicOfActiveWindow}</span>
      </div>

      {/* AREA SHOWING CHAT AND STATUS MESSAGES */}
      <div className="flex-grow overflow-auto">
        {feed.map((el, i) => {
          const time = el.date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });

          return (
            <div className="flex space-x-2" key={i}>
              <span>{time}</span>
              {el.status && (
                <div>
                  <span className="text-blue-700">-</span>
                  <span>!</span>
                  <span className="text-blue-700">-</span>
                </div>
              )}
              {el.user && <span>{`<${el.user}>`}</span>}
              <p>{el.message}</p>
            </div>
          );
        })}
      </div>

      {/* BOTTOM */}
      <div>
        {/* WINDOW STATUS BAR */}
        <div className="flex bg-blue-700 text-white pl-2">
          <div>
            <span className="text-cyan-400">{`[`}</span>
            <span>{clock}</span>
            <span className="text-cyan-400">{`]`}</span>
          </div>

          <div>
            <span className="text-cyan-400">{`[`}</span>
            <span>{`${nick}(${userModeOnServer})`}</span>
            <span className="text-cyan-400">{`]`}</span>
          </div>

          <div>
            <span className="text-cyan-400">{`[`}</span>
            <span>{`${windowNumber}:${networkTag}/#${channelName}(${channelMode})`}</span>
            <span className="text-cyan-400">{`]`}</span>
          </div>
        </div>

        {/* ACTIVE WINDOW INDICATOR */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="flex space-x-2">
              <span>{`[#chat]`}</span>
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
