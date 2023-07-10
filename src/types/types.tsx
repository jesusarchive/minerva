import { FEED_ELEMENT_TYPE, MODE, USER_TYPE } from '@/config/constants';

export type ModeType = keyof typeof MODE;

export type UserType = {
  type: keyof typeof USER_TYPE;
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
  topic: string;
};

export type FeedElementType = {
  id: string;
  date: Date;
  type: keyof typeof FEED_ELEMENT_TYPE;
  user?: UserType;
  text: string;
  preformatted?: boolean;
};

export type FeedType = FeedElementType[];
