import { FEED_ELEMENT_TYPE, MODE, USER_TYPE } from './data/constants';

export type ModeType = (typeof MODE)[keyof typeof MODE];

export type UserType = {
  type: (typeof USER_TYPE)[keyof typeof USER_TYPE];
  nick: string;
  mode?: ModeType;
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
  mode: ModeType;
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
