import React from 'react';

type StatusBarBlockProps = React.HTMLAttributes<HTMLDivElement>;

export default function StatusBarBlock({ children }: StatusBarBlockProps) {
  return (
    <div>
      <span className="text-cyan-400">{`[`}</span>
      {children}
      <span className="text-cyan-400">{`]`}</span>
    </div>
  );
}
