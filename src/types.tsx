import { FEED_ELEMENT_TYPE } from './data/constants';

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

export type FeedElementType = {
  id: string;
  date: Date;
  type: (typeof FEED_ELEMENT_TYPE)[keyof typeof FEED_ELEMENT_TYPE];
  user?: UserType;
  text: string;
  preformatted?: boolean;
};

export type FeedType = FeedElementType[];
