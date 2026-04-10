import React, { useEffect, useState } from 'react';
import { getDebugLogs, clearDebugLogs } from '../services/debugService';

const DebugConsole: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const iv = setInterval(() => setLines(getDebugLogs()), 500);
    setLines(getDebugLogs());
    return () => clearInterval(iv);
  }, []);

  if (typeof window === 'undefined') return null;

  // show only when debug flag present
  if (!window.location.search.includes('debug=1')) return null;

  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, width: 480, maxHeight: '40vh', overflow: 'auto', background: 'rgba(10,10,10,0.9)', color: '#e6e6e6', fontSize: 12, padding: 8, borderRadius: 6, zIndex: 99999 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <strong>Debug Console</strong>
        <button onClick={() => { clearDebugLogs(); setLines([]); }} style={{ background: 'transparent', border: '1px solid #444', color: '#e6e6e6', padding: '2px 6px', borderRadius: 4 }}>Clear</button>
      </div>
      <div>
        {lines.length === 0 ? <div style={{ opacity: 0.6 }}>No logs yet</div> : lines.slice().reverse().map((l, i) => (
          <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'pre-wrap' }}>{l}</div>
        ))}
      </div>
    </div>
  );
};

export default DebugConsole;
