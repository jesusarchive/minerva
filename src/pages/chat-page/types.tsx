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

type FeedElementType = {
  date: Date;
  // used for status messages
  status?: boolean;
  user?: UserType;
  message: string;
};

export type FeedType = FeedElementType[];
