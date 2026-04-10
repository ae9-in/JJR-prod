

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TempleOutline from '../background/TempleOutline';
import SacredFrame from '../components/SacredFrame';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, session } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !contact.trim()) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp(
      email,
      password || `pass_${contact}`, // Use provided password or generate one
      name,
      contact
    );

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
      return;
    }

    setSuccess('Account created successfully.');

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 relative py-20 overflow-hidden">
      {/* Decorative Layering for Form */}
      <div className="absolute top-0 right-0 p-20 opacity-[0.05] pointer-events-none">
        <TempleOutline className="w-96 h-96" />
      </div>
      <div className="absolute bottom-0 left-0 p-20 opacity-[0.05] pointer-events-none rotate-180">
        <TempleOutline className="w-96 h-96" />
      </div>

      <div className="relative z-10 w-full max-w-lg fade-in-ritual">
        <SacredFrame className="bg-[#1A0303]/98 p-14 shadow-4xl border-[#C5A059]/30 backdrop-blur-3xl">
          <div className="text-center mb-12">
            <h1 className="h1-sacred text-4xl mb-4 metallic-gold-text tracking-tight uppercase glow-gold-metallic">Become an Affiliate.</h1>
            <div className="sandalwood-divider w-20 mx-auto mb-6 opacity-30"></div>
            <p className="label-sacred opacity-50 text-[0.45rem] tracking-[0.4em] text-[#E6D5B8]">Join our sacred distribution network</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded p-4 text-center">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded p-4 text-center">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="register-name" className="label-sacred text-[0.6rem] opacity-50 uppercase tracking-widest text-[#E6D5B8]">Full Name</label>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={loading}
                  className="w-full py-4 bg-transparent border-b border-[#C5A059]/30 focus:border-[#C5A059] outline-none text-[#F5F0E1] text-lg font-light placeholder:opacity-20 disabled:opacity-50 tracking-widest"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="register-email" className="label-sacred text-[0.6rem] opacity-50 uppercase tracking-widest text-[#E6D5B8]">Email ID</label>
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full py-4 bg-transparent border-b border-[#C5A059]/30 focus:border-[#C5A059] outline-none text-[#F5F0E1] text-lg font-light placeholder:opacity-20 disabled:opacity-50 tracking-widest"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="register-contact" className="label-sacred text-[0.6rem] opacity-50 uppercase tracking-widest text-[#E6D5B8]">Mobile Number</label>
                <input
                  id="register-contact"
                  type="tel"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  disabled={loading}
                  className="w-full py-4 bg-transparent border-b border-[#C5A059]/30 focus:border-[#C5A059] outline-none text-[#F5F0E1] text-lg font-light placeholder:opacity-20 disabled:opacity-50 tracking-widest"
                  placeholder="8764826746"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="register-password" className="label-sacred text-[0.6rem] opacity-50 uppercase tracking-widest text-[#E6D5B8]">Password</label>
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full py-4 bg-transparent border-b border-[#C5A059]/30 focus:border-[#C5A059] outline-none text-[#F5F0E1] text-lg font-light placeholder:opacity-20 disabled:opacity-50 tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cta-gold w-full py-6 text-[1rem] font-black uppercase tracking-[0.3em] mt-8 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(197,160,89,0.2)]"
            >
              {loading ? 'Processing...' : 'Join as Affiliate'}
            </button>
          </form>
          <p className="text-center mt-12 label-sacred text-[0.55rem] opacity-40 text-[#E6D5B8]">
            Already have an affiliate account? <button onClick={() => navigate('/login')} className="text-[#C5A059] underline underline-offset-8 decoration-[#C5A059]/30 hover:decoration-[#C5A059] transition-all">Login</button>
          </p>
        </SacredFrame>
      </div>
    </div>
  );
};

export default RegisterPage;


