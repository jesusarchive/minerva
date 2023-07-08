import { useState } from 'react';

import { FEED_ELEMENT_TYPE } from '../data/constants';
import { FeedElementType, FeedType } from '../types';
import { generateRandomId } from '../utils';

export function generateFeedElement({
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

function generateFeedStatusElement(text: string): FeedElementType {
  return generateFeedElement({
    type: FEED_ELEMENT_TYPE.STATUS,
    text,
  });
}

export default function useFeed() {
  const [feed, setFeed] = useState<FeedType>([]);
  const [rawFeed, setRawFeed] = useState<FeedType>([]);

  const addFeedElement = (el: FeedElementType) => {
    setFeed([...feed, el]);
    setRawFeed([...rawFeed, el]);
  };

  const clearFeed = () => {
    setFeed([]);
  };

  return {
    feed,
    rawFeed,
    addFeedElement,
    clearFeed,
    generateFeedMessageElement,
    generateFeedStatusElement,
  };
}
