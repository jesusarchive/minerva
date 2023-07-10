import { useState } from 'react';

import { newUser } from '@/config/config';
import { ModeType, UserType } from '@/types/types';

type UseUserProps = {
  defaultUser?: UserType;
  addFeedStatusElement: (text: string) => void;
};

export default function useUser({ defaultUser = newUser, addFeedStatusElement }: UseUserProps) {
  const [user, setUser] = useState<UserType>(defaultUser);

  const setUserNick = (nick: string) => {
    setUser({ ...user, nick });
    const feedbackText = `${user.nick} is now known as ${nick}`;
    addFeedStatusElement(feedbackText);
  };

  const setUserMode = (mode: ModeType) => {
    setUser({ ...user, mode });
    const feedbackText = `${user.nick} is now in ${mode} mode`;
    addFeedStatusElement(feedbackText);
  };

  return { user, setUserNick, setUserMode };
}
