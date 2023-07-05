import React from 'react';

import { FeedType } from './types';

type FeedProps = {
  feed: FeedType;
};

export default function Feed({ feed }: FeedProps) {
  return (
    <>
      {feed.map((el, i) => {
        const time = el.date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        return (
          <div className="flex space-x-2" key={i}>
            {/* TIME */}
            <span>{time}</span>

            {/* STATUS */}
            {el.status && (
              <div>
                <span className="text-blue-700">-</span>
                <span>!</span>
                <span className="text-blue-700">-</span>
              </div>
            )}

            {/* USER */}
            {el.user && <span>{`<${el.user.nick}>`}</span>}

            {/* MESSAGE */}
            <p>{el.message}</p>
          </div>
        );
      })}
    </>
  );
}
