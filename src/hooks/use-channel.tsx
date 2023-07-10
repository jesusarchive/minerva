import { useState } from 'react';

import { channel } from '@/config/config';
import { ChannelType, ModeType } from '@/types/types';

type UseChannelProps = {
  defaultChannel?: ChannelType;
  addFeedStatusElement: (text: string) => void;
};

export default function useChannel({
  defaultChannel = channel,
  addFeedStatusElement,
}: UseChannelProps) {
  const [channel, setChannel] = useState<ChannelType>(defaultChannel);

  const setChannelName = (name: string) => {
    setChannel({ ...channel, name });
    const feedbackText = `${channel.name} name is now ${name}`;
    addFeedStatusElement(feedbackText);
  };

  const setChannelTopic = (topic: string) => {
    setChannel({ ...channel, topic });
    const feedbackText = `Channel topic is now ${topic}`;
    addFeedStatusElement(feedbackText);
  };

  const setChannelMode = (mode: ModeType) => {
    setChannel({ ...channel, mode });
    const feedbackText = `${channel.name} is now in ${mode} mode`;
    addFeedStatusElement(feedbackText);
  };

  return { channel, setChannelName, setChannelTopic, setChannelMode };
}
