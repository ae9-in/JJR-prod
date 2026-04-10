import { supabase } from '../lib/supabase';
import { debugLog } from './debugService';

/**
 * Razorpay Payment Service
 * Handles secure payment initiation through Supabase Edge Functions
 * Order/payment status updates are handled by backend webhooks only
 */

interface RazorpayResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

interface PaymentInitResponse {
  success: boolean;
  razorpay_order_id?: string;
  razorpayOrderId?: string;
  message?: string;
}

/**
 * Load Razorpay script dynamically from CDN
 * Prevents multiple injections by caching the result in a shared promise
 */
let _razorpayLoader: Promise<boolean> | null = null;
const RAZORPAY_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

const loadRazorpayScript = (): Promise<boolean> => {
  if (_razorpayLoader) return _razorpayLoader;

  _razorpayLoader = new Promise((resolve) => {
    try {
      if ((window as any).Razorpay) {
        debugLog('Razorpay SDK already present');
        resolve(true);
        return;
      }

      // Avoid injecting again if script element exists
      const existing = Array.from(document.getElementsByTagName('script')).find(
        (s) => s.src && s.src.indexOf(RAZORPAY_SRC) !== -1
      );
      if (existing) {
        existing.addEventListener('load', () => {
          debugLog('Razorpay script loaded (existing element)');
          resolve(!!(window as any).Razorpay);
        });
        existing.addEventListener('error', () => {
          debugLog('Razorpay script failed to load (existing element)');
          resolve(false);
        });
        return;
      }

      const script = document.createElement('script');
      script.src = RAZORPAY_SRC;
      script.async = true;
      script.onload = () => {
        debugLog('Razorpay SDK loaded');
        resolve(!!(window as any).Razorpay);
      };
      script.onerror = (e) => {
        debugLog('Failed to load Razorpay SDK', String(e));
        resolve(false);
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error('Unexpected error loading Razorpay SDK', err);
      resolve(false);
    }
  });

  return _razorpayLoader;
};

/**
 * Initiate payment through Supabase Edge Function
 * - Calls create-payment Edge Function to get Razorpay order ID
 * - Opens Razorpay Checkout modal
 * - Does NOT update order status (handled by webhook)
 */
export const initiatePayment = async (
  orderId: string,
  amount: number
): Promise<{ paid: boolean; razorpayOrderId?: string }> => {
  // returns an object indicating whether backend marked the order paid
  try {
    if (!supabase) {
      throw new Error('Payment service is not configured');
    }

    // Load Razorpay script if not already loaded
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      console.error('Razorpay SDK failed to load');
      throw new Error('Failed to load Razorpay SDK');
    }

    // Call Supabase Edge Function to create Razorpay order
    debugLog('Invoking create-payment Edge Function', { orderId, amount });
    const { data, error } = await supabase.functions.invoke('create-payment', {
      body: {
        order_id: orderId,
        amount: Math.round(amount * 100), // Convert to paise
      },
    });

    if (error) {
      debugLog('Edge function create-payment returned error', String(error));
      throw new Error(`Payment initiation failed: ${error.message}`);
    }

    // Log raw response for debugging
    console.log('[Payment Debug] Raw create-payment response:', data);

    // Use response as-is (Supabase SDK already parses JSON - no double-parsing)
    const paymentInitData = data as any;

    debugLog('create-payment response', paymentInitData);

    // Extract razorpayOrderId - try multiple field names for compatibility
    const razorpayOrderId = 
      paymentInitData?.razorpayOrderId || 
      paymentInitData?.razorpay_order_id || 
      paymentInitData?.order_id || 
      null;

    // Validate extracted ID is present and is a string
    if (!razorpayOrderId || typeof razorpayOrderId !== 'string') {
      debugLog('Invalid create-payment response: missing or invalid razorpayOrderId', { 
        response: paymentInitData, 
        extractedId: razorpayOrderId,
        idType: typeof razorpayOrderId
      });
      throw new Error('Failed to create payment order: razorpayOrderId is missing or invalid. Response: ' + JSON.stringify(paymentInitData));
    }

    // Warn if success flag is explicitly false (but don't block - ID is what matters)
    if (paymentInitData?.success === false) {
      debugLog('Warning: Edge Function returned success=false but razorpayOrderId present', paymentInitData);
    }

    // Get current user email for Razorpay
    const { data: authData } = await supabase.auth.getUser();
    const userEmail = authData.user?.email || '';

    // Initialize Razorpay Checkout
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      debugLog('VITE_RAZORPAY_KEY_ID is not defined');
      throw new Error('Razorpay Key ID not configured (VITE_RAZORPAY_KEY_ID)');
    }

    // Validate Key ID looks like public key id (rzp_test_... or rzp_live_...)
    const keyPattern = /^rzp_(test|live)_[A-Za-z0-9]+$/;
    if (!keyPattern.test(String(razorpayKey))) {
      debugLog('VITE_RAZORPAY_KEY_ID looks invalid', String(razorpayKey));
      throw new Error('Razorpay Key ID appears invalid. Ensure you set the public Key ID (rzp_test_...) not the secret.');
    }

    if (!(window as any).Razorpay) {
      debugLog('window.Razorpay is not available even after loading script');
      throw new Error('Razorpay SDK unavailable even after loading script');
    }

    return await new Promise<{ paid: boolean; razorpayOrderId?: string }>((resolve, reject) => {
      let resolved = false;

      const options: any = {
        key: razorpayKey,
        order_id: razorpayOrderId,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'Jaya Janardhana',
        description: `Order #${orderId}`,
        prefill: {
          email: userEmail,
        },
        theme: { color: '#C5A059' },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          debugLog('Razorpay handler called', response);
          // After handler is called, the backend webhook should verify and update order status.
          // Poll order status for a short period to reflect backend update.
          try {
            const start = Date.now();
            const timeoutMs = 30_000; // 30s
            const pollInterval = 2000;

            while (Date.now() - start < timeoutMs) {
              const status = await checkOrderStatus(orderId);
              if (status && (status.status === 'COMPLETED' || status.payment_status === 'paid' || status.status === 'PAID')) {
                resolved = true;
                resolve({ paid: true, razorpayOrderId });
                return;
              }
              await new Promise((r) => setTimeout(r, pollInterval));
            }

            debugLog('Payment handler: webhook did not mark order paid within timeout');
            resolved = true;
            resolve({ paid: false, razorpayOrderId });
          } catch (err) {
            debugLog('Error while polling order status after payment handler', String(err));
            if (!resolved) reject(err);
          }
        },
        modal: {
          ondismiss: async () => {
            debugLog('Razorpay modal dismissed');
            if (resolved) return;
            // If dismissed, check order status once and resolve accordingly
            try {
              const status = await checkOrderStatus(orderId);
              resolved = true;
              resolve({ paid: !!(status && (status.status === 'COMPLETED' || status.payment_status === 'paid' || status.status === 'PAID')) , razorpayOrderId});
            } catch (err) {
              debugLog('Error checking order status after dismissal', String(err));
              if (!resolved) reject(err);
            }
          }
        }
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        debugLog('Opening Razorpay checkout', { razorpayOrderId, orderId });
        rzp.open();
      } catch (err) {
        debugLog('Failed to open Razorpay checkout', String(err));
        if (!resolved) reject(err);
      }
    });
  } catch (error) {
    debugLog('Payment initiation error:', String(error));
    throw error;
  }
};

/**
 * Helper to fetch current order status from Supabase
 * Used to check if payment was verified by webhook
 */
export const checkOrderStatus = async (
  orderId: string
): Promise<{ status: string; payment_status?: string } | null> => {
  try {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('status, payment_status')
      .eq('id', orderId)
      .single();

    if (error) {
      debugLog('Error fetching order status:', String(error));
      return null;
    }

    return data;
  } catch (error) {
    debugLog('Unexpected error checking order status:', String(error));
    return null;
  }
};

export const paymentService = {
  initiatePayment,
  checkOrderStatus,
  loadRazorpayScript,
  loadRazorpay: loadRazorpayScript,
};

export default paymentService;
