import { FEED_ELEMENT_TYPE } from './constants';

export type UserType = {
  nick: string;
  mode: string;
};

export type WindowType = {
  id: number;
  topic: string;
};

export type NetworkType = {
  tag: string;
};

export type ChannelType = {
  name: string;
  mode: string;
};

type FeedElementTypes = (typeof FEED_ELEMENT_TYPE)[keyof typeof FEED_ELEMENT_TYPE];

type FeedElementType = {
  date: Date;
  type: FeedElementTypes;
  user?: UserType;
  message: string;
};

export type FeedType = FeedElementType[];
