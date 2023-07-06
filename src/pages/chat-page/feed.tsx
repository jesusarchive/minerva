import React from 'react';

import { FEED_ELEMENT_TYPE } from './constants';
import { getTimeString } from './helpers';
import { FeedType } from './types';

type FeedProps = {
  feed: FeedType;
};

export default function Feed({ feed }: FeedProps) {
  return (
    <>
      {feed.map((el, i) => {
        const time = getTimeString(el.date);

        return (
          <div className="flex space-x-2" key={i}>
            <span>{time}</span>

            {/* STATUS MESSAGE INDICATOR */}
            {el.type === FEED_ELEMENT_TYPE.STATUS && (
              <div>
                <span className="text-blue-700">-</span>
                <span>!</span>
                <span className="text-blue-700">-</span>
              </div>
            )}

            {el.user && <span>{`<${el.user.nick}>`}</span>}

            <p>{el.message}</p>
          </div>
        );
      })}
    </>
  );
}
