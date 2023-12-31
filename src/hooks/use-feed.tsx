import { useState } from 'react';

import { FEED_ELEMENT_TYPE } from '@/config/constants';
import { FeedElementType, FeedType } from '@/types/types';
import { generateRandomId } from '@/utils';

function generateFeedElement({
  ...feedElement
}: Omit<FeedElementType, 'id' | 'date'>): FeedElementType {
  return {
    id: generateRandomId(),
    date: new Date(),
    ...feedElement,
  };
}

function generateFeedMessageElement({
  ...feedElement
}: Omit<FeedElementType, 'id' | 'date' | 'type'>): FeedElementType {
  return generateFeedElement({
    type: FEED_ELEMENT_TYPE.MESSAGE,
    ...feedElement,
  });
}

function generateFeedStatusElement({ text }: { text: string }): FeedElementType {
  return generateFeedElement({
    type: FEED_ELEMENT_TYPE.STATUS,
    text,
  });
}

// TODO: review to change to context
export default function useFeed() {
  const [feed, setFeed] = useState<FeedType>([]);
  const [rawFeed, setRawFeed] = useState<FeedType>([]);

  // generic for feed element with more params
  const addFeedElement = (el: FeedElementType) => {
    setFeed([...feed, el]);
    setRawFeed([...rawFeed, el]);
  };

  // simple for status messages
  const addFeedStatusElement = (text: string) => {
    const feedElement = generateFeedStatusElement({ text });
    addFeedElement(feedElement);
  };

  const clearFeed = () => {
    setFeed([]);
  };

  return {
    feed,
    rawFeed,
    addFeedElement,
    addFeedStatusElement,
    clearFeed,
    generateFeedMessageElement,
  };
}
