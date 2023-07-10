import StatusBar from './status-bar';
import StatusBarBlock from './status-bar-block';

// wrap status bar with block
export default Object.assign(StatusBar, {
  Block: StatusBarBlock,
});
export * from './status-bar';
