
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Lock, Smartphone, CreditCard, Globe, Wallet, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, RefreshCw, MapPin, Edit2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { paymentService } from '../services/paymentService';
import { edgeService } from '../services/edgeService';
import SacredFrame from '../components/SacredFrame';
import DebugConsole from '../components/DebugConsole';

type PaymentStep = 'REVIEW' | 'PROCESSING' | 'SUCCESS' | 'FAILURE';
type PaymentMethod = 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET';

const PaymentPage: React.FC = () => {
  const context = useAppContext();
  const { cart, user, deliveryAddress } = context.state;
  
  const [step, setStep] = useState<PaymentStep>('REVIEW');
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [orderId, setOrderId] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Calculate totals
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalMargin = cart.reduce((sum, item) => sum + (item.price * (item.commissionRate / 100) * item.quantity), 0);

  // Redirect if cart is empty and not in success state
  if (cart.length === 0 && step !== 'SUCCESS') {
    return <Navigate to="/catalog" />;
  }

  // Redirect if no delivery address is present
  if (!deliveryAddress && step !== 'SUCCESS') {
    return <Navigate to="/address" />;
  }

  const handlePayment = async () => {
    setStep('PROCESSING');
    setPaymentError(null);
    let createdOrderId: string | null = null;
    
    try {
      // Step 1: Create order in Supabase
      const order = await context.placeOrder();
      
      if (!order) {
        throw new Error('Failed to create order');
      }

      setOrderId(order.id);
      createdOrderId = order.id;

      // Step 2: Run smart-endpoint to analyze order (optional intelligence processing)
      const smartEndpointResult = await edgeService.runSmartEndpoint({
        orderId: order.id,
        totalAmount,
        itemCount: cart.length,
        userEmail: user?.email,
      });

      if (!smartEndpointResult.success) {
        console.warn('Smart endpoint returned non-success, but continuing:', smartEndpointResult.error);
      } else {
        console.debug('Smart endpoint processed order:', smartEndpointResult.data);
      }

      // Step 3: Initiate payment through Razorpay via Edge Function
      const result = await paymentService.initiatePayment(order.id, totalAmount);

      // show success UI only if backend webhook marked order as paid
      if (result.paid) {
        context.completeOrder(order);
        setStep('SUCCESS');
      } else {
        await context.cancelOrder(order.id);
        // Not marked paid yet (either dismissed or webhook pending)
        setPaymentError('Payment not verified yet. Check Order History for updates.');
        setStep('REVIEW');
      }
    } catch (error) {
      if (createdOrderId) {
        await context.cancelOrder(createdOrderId);
      }
      console.error('Payment error:', error);
      setPaymentError(
        error instanceof Error ? error.message : 'Payment processing failed'
      );
      setStep('FAILURE');
    }
  };

  // -------------------------
  // SUCCESS STATE
  // -------------------------
  if (step === 'SUCCESS') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 fade-in-ritual">
        <SacredFrame className="bg-[#1A0303]/95 border-[#C5A059]/30 p-12 max-w-lg w-full text-center shadow-2xl backdrop-blur-3xl">
          <div className="w-20 h-20 bg-[#2D6A4F]/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#2D6A4F]/40">
            <CheckCircle size={40} className="text-[#4ADE80]" />
          </div>
          
          <h2 className="h1-sacred text-3xl text-[#F5F0E1] mb-2">Payment Initiated</h2>
          <p className="label-sacred text-[#C5A059] text-[0.6rem] tracking-[0.2em] uppercase mb-8">Order Ref: {orderId}</p>
          
          <div className="sandalwood-divider w-full mb-8 opacity-20"></div>
          
          <p className="body-sacred text-[#E6D5B8]/80 mb-10 leading-relaxed">
            Your order has been created and payment is being processed. Inventory will be allocated to your account once payment is verified.
          </p>
          
          <div className="flex flex-col gap-4">
            <button onClick={() => window.location.hash = '/order-history'} className="cta-gold w-full py-5 text-[0.7rem] uppercase tracking-widest">
              View Order History
            </button>
            <button onClick={() => window.location.hash = '/catalog'} className="label-sacred text-[0.6rem] text-[#E6D5B8]/50 hover:text-[#C5A059] py-2 uppercase tracking-widest">
              Return to Catalog
            </button>
          </div>
        </SacredFrame>
      </div>
    );
  }

  // -------------------------
  // FAILURE STATE
  // -------------------------
  if (step === 'FAILURE') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 fade-in-ritual">
        <SacredFrame className="bg-[#1A0303]/95 border-red-900/30 p-12 max-w-lg w-full text-center shadow-2xl backdrop-blur-3xl">
          <div className="w-20 h-20 bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
            <AlertCircle size={40} className="text-red-400" />
          </div>
          
          <h2 className="h1-sacred text-3xl text-[#F5F0E1] mb-2">Transaction Failed</h2>
          <p className="label-sacred text-red-400/60 text-[0.6rem] tracking-[0.2em] uppercase mb-8">No Amount Deducted</p>
          
          <p className="body-sacred text-[#E6D5B8]/80 mb-10 leading-relaxed">
            {paymentError || 'We could not complete your request. Please check your connection or payment method and try again.'}
          </p>
          
          <div className="flex flex-col gap-4">
            <button onClick={() => { setStep('REVIEW'); setPaymentError(null); }} className="cta-outline-gold w-full py-5 text-[0.7rem] uppercase tracking-widest flex items-center justify-center gap-3">
              <RefreshCw size={16} /> Retry Payment
            </button>
            <button onClick={() => window.location.hash = '/cart'} className="label-sacred text-[0.6rem] text-[#E6D5B8]/50 hover:text-[#C5A059] py-2 uppercase tracking-widest">
              Return to Cart
            </button>
          </div>
        </SacredFrame>
      </div>
    );
  }

  // -------------------------
  // REVIEW & PROCESSING STATE
  // -------------------------
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-32 fade-in-ritual relative z-10">
      <div className="flex items-center gap-4 mb-10">
        <Lock size={20} className="text-[#C5A059]" />
        <h1 className="h1-sacred text-3xl text-[#F5F0E1] glow-gold-solid">Secure Payment</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* LEFT COLUMN: Payment Methods */}
        <div className="lg:w-2/3 space-y-8">
          
          {/* Shipping Summary */}
          {deliveryAddress && (
            <SacredFrame className="bg-[#1A0303]/40 p-6 border-[#C5A059]/20 flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-[#2D0505] rounded-full border border-[#C5A059]/20">
                  <MapPin size={16} className="text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="label-sacred text-[0.55rem] text-[#E6D5B8]/60 uppercase tracking-widest mb-1">Delivering To</h4>
                  <p className="h1-sacred text-[#F5F0E1] text-lg">{deliveryAddress.fullName}</p>
                  <p className="body-sacred text-sm text-[#E6D5B8]/80">
                    {deliveryAddress.addressLine1}, {deliveryAddress.addressLine2 ? deliveryAddress.addressLine2 + ', ' : ''}
                    <br />
                    {deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}
                  </p>
                  <p className="text-xs text-[#E6D5B8]/50 mt-1">Mobile: {deliveryAddress.mobile}</p>
                </div>
              </div>
              <button 
                onClick={() => window.location.hash = '/address'} 
                className="p-2 hover:bg-[#C5A059]/10 rounded-sm text-[#C5A059] transition-colors"
                title="Edit Address"
              >
                <Edit2 size={16} />
              </button>
            </SacredFrame>
          )}

          <SacredFrame className="bg-[#1A0303]/80 p-8 border-[#C5A059]/20">
            <h3 className="label-sacred text-[#C5A059] text-[0.6rem] uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldCheck size={14} /> Payment Method
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: 'UPI', label: 'UPI / BHIM', icon: <Smartphone size={20} /> },
                { id: 'CARD', label: 'Debit / Credit Card', icon: <CreditCard size={20} /> },
                { id: 'NETBANKING', label: 'Net Banking', icon: <Globe size={20} /> },
                { id: 'WALLET', label: 'Wallets', icon: <Wallet size={20} /> },
              ].map((m) => (
                <div 
                  key={m.id}
                  onClick={() => setMethod(m.id as PaymentMethod)}
                  className={`
                    cursor-pointer p-6 border rounded-sm transition-all flex items-center gap-4 group
                    ${method === m.id 
                      ? 'bg-[#2D0505] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.15)]' 
                      : 'bg-[#1A0303]/60 border-[#C5A059]/10 hover:border-[#C5A059]/30 hover:bg-[#2D0505]/50'
                    }
                  `}
                >
                  <div className={`p-3 rounded-full ${method === m.id ? 'bg-[#C5A059] text-[#1A0303]' : 'bg-[#1A0303] border border-[#C5A059]/20 text-[#C5A059]'}`}>
                    {m.icon}
                  </div>
                  <span className={`label-sacred text-[0.7rem] uppercase tracking-wider font-bold ${method === m.id ? 'text-[#F5F0E1]' : 'text-[#E6D5B8]/60 group-hover:text-[#C5A059]'}`}>
                    {m.label}
                  </span>
                  {method === m.id && <div className="ml-auto w-2 h-2 bg-[#C5A059] rounded-full shadow-[0_0_8px_#C5A059]"></div>}
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-sm flex items-start gap-3">
               <Lock size={14} className="text-[#C5A059] mt-0.5 opacity-60" />
               <p className="label-sacred text-[0.5rem] text-[#E6D5B8]/50 leading-relaxed normal-case tracking-wide">
                 All payments are encrypted and processed securely. Jaya Janardhana does not store your card or bank details.
               </p>
            </div>
          </SacredFrame>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="lg:w-1/3">
          <SacredFrame className="bg-[#E6D5B8]/5 border-[#C5A059]/30 p-8 sticky top-32">
            <h3 className="label-sacred text-[#E6D5B8]/60 text-[0.6rem] uppercase tracking-widest mb-6">Sourcing Summary</h3>
            
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div>
                    <p className="h1-sacred text-[#F5F0E1] text-base">{item.name}</p>
                    <p className="label-sacred text-[0.5rem] text-[#C5A059] opacity-70 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <p className="h1-sacred text-[#E6D5B8]/80 text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#C5A059]/20 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                 <span className="label-sacred text-[0.6rem] text-[#E6D5B8]/60 uppercase tracking-widest">Sourcing Total</span>
                 <span className="h1-sacred text-xl text-[#F5F0E1]">₹{totalAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center bg-[#C5A059]/10 p-3 -mx-3 rounded-sm border border-[#C5A059]/10">
                 <span className="label-sacred text-[0.55rem] text-[#C5A059] uppercase tracking-widest">Projected Margin</span>
                 <span className="h1-sacred text-lg text-[#C5A059]">₹{totalMargin.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handlePayment} 
              disabled={step === 'PROCESSING'}
              className="cta-gold w-full mt-8 py-5 text-[0.75rem] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {step === 'PROCESSING' ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1A0303] border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Pay <ArrowRight size={16} />
                </>
              )}
            </button>
            
            <div className="mt-6 text-center">
              <span className="label-sacred text-[0.45rem] text-[#E6D5B8]/30 uppercase tracking-widest">
                Authorized for {user?.name}
              </span>
            </div>
          </SacredFrame>
        </div>
      </div>
      {import.meta.env.DEV ? <DebugConsole /> : null}
    </div>
  );
};

export default PaymentPage;
