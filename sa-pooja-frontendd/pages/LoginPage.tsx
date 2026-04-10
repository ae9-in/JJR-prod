
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TempleOutline from '../background/TempleOutline';
import SacredFrame from '../components/SacredFrame';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, session, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Effect: Redirect if user is already authenticated
  useEffect(() => {
    // Check SESSION instead of user profile
    if (!authLoading && session) {
      const redirectTo = location.state?.redirectTo || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [session, authLoading, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    // Handle login errors
    if (signInError) {
      setError(signInError);
      setLoading(false);
    }
    // If successful, the useEffect will trigger redirect via onAuthStateChange
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border border-[#C5A059] border-t-transparent"></div>
          <p className="mt-4 text-[#C5A059]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 relative py-20 overflow-hidden">
      <div className="absolute top-0 right-0 p-20 opacity-[0.05] pointer-events-none">
        <TempleOutline className="w-96 h-96" />
      </div>
      <div className="absolute bottom-0 left-0 p-20 opacity-[0.05] pointer-events-none rotate-180">
        <TempleOutline className="w-96 h-96" />
      </div>

      <div className="relative z-10 w-full max-w-lg fade-in-ritual">
        <SacredFrame className="bg-[#1A0303]/98 p-14 shadow-4xl border-[#C5A059]/30 backdrop-blur-3xl">
          <div className="text-center mb-16">
            <h1 className="h1-sacred text-4xl mb-4 metallic-gold-text tracking-tight uppercase glow-gold-metallic">Partner Access.</h1>
            <div className="sandalwood-divider w-20 mx-auto mb-6 opacity-30"></div>
            <p className="label-sacred opacity-50 text-[0.45rem] tracking-[0.4em] text-[#E6D5B8]">Secure Community Login</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-10">
            {location.state?.fromCart && (
              <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded p-3">
                <p className="text-[#E6D5B8] text-sm">Your cart items are saved. Please log in to continue to checkout.</p>
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="login-email" className="label-sacred text-[0.6rem] opacity-50 uppercase tracking-widest text-[#E6D5B8]">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                className="w-full py-4 bg-transparent border-b border-[#C5A059]/30 focus:border-[#C5A059] outline-none text-[#F5F0E1] text-lg font-light placeholder:opacity-20 disabled:opacity-50"
                required
                placeholder="partner@ashram.in"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="login-password" className="label-sacred text-[0.6rem] opacity-50 uppercase tracking-widest text-[#E6D5B8]">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full py-4 bg-transparent border-b border-[#C5A059]/30 focus:border-[#C5A059] outline-none text-[#F5F0E1] text-lg font-light placeholder:opacity-20 pr-10 disabled:opacity-50"
                  required
                  placeholder="••••••••"
                />
                {/* Password visibility toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-0 bottom-4 text-[#C5A059]/60 hover:text-[#C5A059] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="cta-gold w-full py-6 text-[0.8rem] font-black uppercase tracking-[0.3em] mt-8 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Verifying...' : 'Enter Portal'}
            </button>
          </form>
          <p className="text-center mt-12 label-sacred text-[0.55rem] opacity-30 text-[#E6D5B8]">New to community? <button onClick={() => navigate('/register')} className="text-[#C5A059] underline underline-offset-8">Become an Affiliate</button></p>
        </SacredFrame>
      </div>
    </div>
  );
};

export default LoginPage;
