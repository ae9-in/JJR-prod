import { supabase } from '../lib/supabase';
import { debugLog } from './debugService';

/**
 * Edge Service - Safely invoke Supabase Edge Functions
 * All invocations use the authenticated Supabase client
 */

interface EdgeFunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Run the rapid-processor Edge Function
 * Used for quick, real-time processing tasks
 */
export const runRapidProcessor = async (
  payload: Record<string, any>
): Promise<EdgeFunctionResponse> => {
  try {
    if (!supabase) {
      throw new Error('Edge functions are not configured');
    }

    debugLog('Invoking rapid-processor with payload', payload);

    const { data, error } = await supabase.functions.invoke('rapid-processor', {
      body: payload,
    });

    if (error) {
      debugLog('rapid-processor error', String(error));
      throw new Error(`rapid-processor failed: ${error.message}`);
    }

    debugLog('rapid-processor response', data);

    return {
      success: true,
      data: data,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    debugLog('runRapidProcessor error:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Run the smart-endpoint Edge Function
 * Used for intelligent data analysis and processing
 */
export const runSmartEndpoint = async (
  payload: Record<string, any>
): Promise<EdgeFunctionResponse> => {
  try {
    if (!supabase) {
      throw new Error('Edge functions are not configured');
    }

    debugLog('Invoking smart-endpoint with payload', payload);

    const { data, error } = await supabase.functions.invoke('smart-endpoint', {
      body: payload,
    });

    if (error) {
      debugLog('smart-endpoint error', String(error));
      throw new Error(`smart-endpoint failed: ${error.message}`);
    }

    debugLog('smart-endpoint response', data);

    return {
      success: true,
      data: data,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    debugLog('runSmartEndpoint error:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Batch invoke multiple Edge Functions in parallel
 * Returns results in order
 */
export const batchInvokeEdgeFunctions = async (
  functions: Array<{
    name: 'rapid-processor' | 'smart-endpoint';
    payload: Record<string, any>;
  }>
): Promise<EdgeFunctionResponse[]> => {
  try {
    debugLog('Batch invoking edge functions', { count: functions.length });

    const promises = functions.map((fn) => {
      if (fn.name === 'rapid-processor') {
        return runRapidProcessor(fn.payload);
      } else if (fn.name === 'smart-endpoint') {
        return runSmartEndpoint(fn.payload);
      }
      return Promise.resolve({
        success: false,
        error: `Unknown function: ${fn.name}`,
      });
    });

    const results = await Promise.all(promises);
    debugLog('Batch invoke results', results);

    return results;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    debugLog('batchInvokeEdgeFunctions error:', errorMessage);
    return [
      {
        success: false,
        error: errorMessage,
      },
    ];
  }
};

export const edgeService = {
  runRapidProcessor,
  runSmartEndpoint,
  batchInvokeEdgeFunctions,
};

export default edgeService;
