import React from 'react';

type StatusBarBlockProps = React.HTMLAttributes<HTMLDivElement>;

function StatusBarBlock({ children }: StatusBarBlockProps) {
  return (
    <div>
      <span className="text-cyan-400">{`[`}</span>
      {children}
      <span className="text-cyan-400">{`]`}</span>
    </div>
  );
}

type StatusBarProps = React.HTMLAttributes<HTMLDivElement>;

function StatusBarComponent(props: StatusBarProps) {
  return <div className="flex overflow-auto bg-blue-700 text-white pl-2" {...props} />;
}

// Wrap StatusBarBlock with StatusBar
const StatusBar = Object.assign(StatusBarComponent, {
  Block: StatusBarBlock,
});

export default StatusBar;
