const logs: string[] = [];

export const debugLog = (...args: any[]) => {
  try {
    const message = args.map(a => {
      if (typeof a === 'string') return a;
      try { return JSON.stringify(a); } catch { return String(a); }
    }).join(' ');
    logs.push(`${new Date().toISOString()} ${message}`);
    // keep array small
    if (logs.length > 200) logs.shift();
  } catch (e) {
    // noop
  }
  // still log to console for developers
  // eslint-disable-next-line no-console
  console.log(...args);
};

export const getDebugLogs = () => logs.slice();

export const clearDebugLogs = () => { logs.length = 0 };

export default {
  debugLog,
  getDebugLogs,
  clearDebugLogs
};
