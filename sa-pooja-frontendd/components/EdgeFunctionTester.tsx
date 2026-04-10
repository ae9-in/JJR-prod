import React, { useState } from 'react';
import { edgeService } from '../services/edgeService';
import SacredFrame from './SacredFrame';

/**
 * EdgeFunctionTester Component
 * Allows manual testing of Edge Functions during development
 * Only visible when ?edgetest=1 is in URL
 */
const EdgeFunctionTester: React.FC = () => {
  const [rapidResult, setRapidResult] = useState<any>(null);
  const [smartResult, setSmartResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (typeof window === 'undefined' || !window.location.search.includes('edgetest=1')) {
    return null;
  }

  const handleTestRapidProcessor = async () => {
    setLoading(true);
    const result = await edgeService.runRapidProcessor({
      timestamp: new Date().toISOString(),
      testPayload: 'testing rapid-processor',
    });
    setRapidResult(result);
    setLoading(false);
  };

  const handleTestSmartEndpoint = async () => {
    setLoading(true);
    const result = await edgeService.runSmartEndpoint({
      timestamp: new Date().toISOString(),
      testPayload: 'testing smart-endpoint',
    });
    setSmartResult(result);
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', left: 12, bottom: 12, width: 500, maxHeight: '60vh', overflow: 'auto', background: 'rgba(10,10,10,0.95)', color: '#e6e6e6', fontSize: 11, padding: 12, borderRadius: 6, zIndex: 99998, fontFamily: 'monospace' }}>
      <div style={{ marginBottom: 12 }}>
        <strong>Edge Function Tester</strong>
      </div>

      <div style={{ marginBottom: 12, display: 'flex', gap: 6 }}>
        <button onClick={handleTestRapidProcessor} disabled={loading} style={{ padding: '6px 12px', background: '#C5A059', color: '#1A0303', border: 'none', borderRadius: 4, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
          Test rapid-processor
        </button>
        <button onClick={handleTestSmartEndpoint} disabled={loading} style={{ padding: '6px 12px', background: '#4ADE80', color: '#1A0303', border: 'none', borderRadius: 4, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
          Test smart-endpoint
        </button>
      </div>

      {rapidResult && (
        <div style={{ marginBottom: 12, padding: 10, background: 'rgba(197,160,89,0.1)', borderLeft: '2px solid #C5A059' }}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>rapid-processor</div>
          <div>{JSON.stringify(rapidResult, null, 2)}</div>
        </div>
      )}

      {smartResult && (
        <div style={{ marginBottom: 12, padding: 10, background: 'rgba(74,222,128,0.1)', borderLeft: '2px solid #4ADE80' }}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>smart-endpoint</div>
          <div>{JSON.stringify(smartResult, null, 2)}</div>
        </div>
      )}
    </div>
  );
};

export default EdgeFunctionTester;
