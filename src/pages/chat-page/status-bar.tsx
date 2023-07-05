import React from 'react';

import StatusBarBlock from './status-bar-block';

type StatusBarProps = React.HTMLAttributes<HTMLDivElement>;

function StatusBarComponent(props: StatusBarProps) {
  return <div className="flex overflow-auto bg-blue-700 text-white pl-2" {...props} />;
}

const StatusBar = Object.assign(StatusBarComponent, {
  Block: StatusBarBlock,
});

export default StatusBar;
