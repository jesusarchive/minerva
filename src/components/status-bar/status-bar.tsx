import React from 'react';

type StatusBarProps = {
  children: React.ReactNode;
};

export default function StatusBar(props: StatusBarProps) {
  return <div className="flex overflow-auto bg-blue-700 text-white pl-2">{props.children}</div>;
}
