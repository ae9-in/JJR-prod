
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ShieldCheck, Home } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SacredFrame from '../components/SacredFrame';
import { DeliveryAddress } from '../types';

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  touched: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, id, name, type = "text", required = true, placeholder, value, onChange, onBlur, touched 
}) => {
  const isInvalid = touched && required && !value;
  
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="label-sacred text-[0.55rem] text-[#C5A059] uppercase tracking-widest flex items-center justify-between">
        {label} {required && <span className="text-red-400/50">*</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`
          w-full py-3 bg-transparent border-b outline-none text-[#1A0303] text-sm placeholder:opacity-30 transition-colors
          ${isInvalid ? 'border-red-400/50' : 'border-[#C5A059]/30 focus:border-[#C5A059]'}
        `}
      />
      {isInvalid && <span className="text-[0.6rem] text-red-700/60 font-serif italic">This field is required for logistics.</span>}
    </div>
  );
};

const AddressPage: React.FC = () => {
  const context = useAppContext();
  const navigate = useNavigate();
  const { cart, deliveryAddress, user } = context.state;

  const [formData, setFormData] = useState<DeliveryAddress>({
    fullName: user?.name || '',
    mobile: user?.contact || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Autofill if address exists in context
  useEffect(() => {
    if (deliveryAddress) {
      setFormData(deliveryAddress);
    }
  }, [deliveryAddress]);

  // Redirect if cart is empty
  if (cart.length === 0) {
    return <Navigate to="/catalog" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const isValid = () => {
    return (
      formData.fullName.trim().length > 0 &&
      formData.mobile.trim().length >= 10 &&
      formData.addressLine1.trim().length > 0 &&
      formData.city.trim().length > 0 &&
      formData.state.trim().length > 0 &&
      formData.pincode.trim().length >= 5
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) {
      context.setDeliveryAddress(formData);
      navigate('/payment');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-20 fade-in-ritual">
      <div className="w-full max-w-xl relative z-10">
        <SacredFrame className="bg-[#F5F0E1] p-10 md:p-14 shadow-2xl border-[#C5A059]/30">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#2D0505] rounded-full flex items-center justify-center border border-[#C5A059]/30">
              <MapPin size={20} className="text-[#C5A059]" />
            </div>
            <div>
              <h1 className="h1-sacred text-2xl text-[#1A0303]">Delivery Details</h1>
              <p className="label-sacred text-[0.5rem] text-[#8E6C27] tracking-widest uppercase mt-1">
                Where should we ship your inventory?
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <InputField 
                label="Full Name" 
                id="address-full-name"
                name="fullName" 
                placeholder="Receiver's Name" 
                value={formData.fullName} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                touched={!!touched.fullName}
              />
              <InputField 
                label="Mobile Number" 
                id="address-mobile"
                name="mobile" 
                type="tel" 
                placeholder="+91" 
                value={formData.mobile} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                touched={!!touched.mobile}
              />
            </div>

            <InputField 
              label="Address Line 1" 
              id="address-line-1"
              name="addressLine1" 
              placeholder="House No, Building, Temple Name" 
              value={formData.addressLine1} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              touched={!!touched.addressLine1}
            />
            <InputField 
              label="Address Line 2 (Optional)" 
              id="address-line-2"
              name="addressLine2" 
              required={false} 
              placeholder="Area, Landmark, Street" 
              value={formData.addressLine2 || ''} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              touched={!!touched.addressLine2}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <InputField 
                label="City" 
                id="address-city"
                name="city" 
                placeholder="Town / City" 
                value={formData.city} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                touched={!!touched.city}
              />
              <InputField 
                label="State" 
                id="address-state"
                name="state" 
                placeholder="State" 
                value={formData.state} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                touched={!!touched.state}
              />
              <div className="col-span-2 md:col-span-1">
                <InputField 
                  label="Pincode" 
                  id="address-pincode"
                  name="pincode" 
                  placeholder="000000" 
                  value={formData.pincode} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  touched={!!touched.pincode}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#C5A059]/20 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex items-start gap-3 opacity-70">
                <ShieldCheck size={16} className="text-[#8E6C27] mt-1 shrink-0" />
                <p className="body-sacred text-xs text-[#1A0303]/70 leading-relaxed max-w-xs">
                  Your address is securely linked to this order for logistics coordination only.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={!isValid()}
                className={`
                  cta-gold px-10 py-4 text-[0.7rem] uppercase tracking-widest flex items-center gap-3 transition-all
                  ${!isValid() ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:translate-x-1'}
                `}
              >
                Continue to Payment <ArrowRight size={16} />
              </button>
            </div>
          </form>

        </SacredFrame>
      </div>
    </div>
  );
};

export default AddressPage;
