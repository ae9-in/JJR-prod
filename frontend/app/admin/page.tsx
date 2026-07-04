'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const C = {
  gold: '#C5A059',
  goldDark: '#8e6c27',
  goldLight: '#f7e7c0',
  maroon: '#1A0303',
  maroonLight: '#2D0505',
  beige: '#E6D5B8',
  white: '#F5F0E1',
  success: '#10b981',
  error: '#ef4444',
  border: 'rgba(197, 160, 89, 0.15)'
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dashboard Data
  const [orders, setOrders] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions'>('orders');
  const [searchTerm, setSearchTerm] = useState('');

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email === 'admin@gmail.com' && loginForm.password === 'admin123') {
      setIsLoggedIn(true);
      sessionStorage.setItem('jj_admin_auth', 'true');
      setError('');
    } else {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('jj_admin_auth');
  };

  // Fetch Dashboard Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setSubscriptions(data.subscriptions || []);
      } else {
        console.error('Failed to load admin data:', data.error);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load session & data
  useEffect(() => {
    const isAuth = sessionStorage.getItem('jj_admin_auth') === 'true';
    if (isAuth) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  // Admin Action Handler (Delete/Status Change)
  const handleAction = async (action: 'delete' | 'update_status', type: 'order' | 'subscription', id: string, status?: string) => {
    if (action === 'delete' && !confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, type, id, status })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local data
        fetchData();
      } else {
        alert(`Action failed: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Action error: ${err.message}`);
    }
  };

  // Filter lists based on search term
  const filteredOrders = orders.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.phone.includes(searchTerm) ||
    o.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubscriptions = subscriptions.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm) ||
    s.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Earning computations
  const totalOrderRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeSubscriptionCount = subscriptions.filter(s => s.status === 'active' || s.status === 'pending').length;

  const inputStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    background: '#F5F0E1',
    border: '2px solid transparent',
    color: '#1A0303',
    outline: 'none',
    marginBottom: '16px',
    fontSize: '15px',
    boxSizing: 'border-box' as 'border-box',
    fontWeight: 500
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: C.maroon,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: C.white,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          background: 'rgba(45, 5, 5, 0.95)',
          border: `1px solid ${C.gold}33`,
          borderRadius: '24px',
          padding: '48px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}>
          <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/assets/logo.png" alt="Jaya Janardhana Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.gold, marginBottom: '8px' }}>Admin Portal</h2>
          <p style={{ fontSize: '13px', color: C.beige, opacity: 0.7, marginBottom: '24px' }}>Secure console for Jaya Janardhana storefront management</p>
          
          {error && (
            <div style={{
              color: C.error,
              fontSize: '13px',
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Admin Email"
              style={inputStyle}
              required
              value={loginForm.email}
              onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              style={inputStyle}
              required
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`,
                color: C.maroon,
                border: 'none',
                borderRadius: '100px',
                padding: '16px',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              Sign In to Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.maroon,
      color: C.white,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${C.border}`,
          paddingBottom: '24px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src="/assets/logo.png" alt="Jaya Janardhana Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: C.gold, margin: 0 }}>Jaya Janardhana</h1>
              <p style={{ fontSize: '12px', color: C.beige, opacity: 0.6, margin: 0 }}>Sacred Sourcing Storefront Admin Panel</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: `1px solid ${C.gold}88`,
              color: C.gold,
              padding: '10px 24px',
              borderRadius: '100px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Logout Dashboard
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <div style={{
            background: C.maroonLight,
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: C.beige, opacity: 0.6, letterSpacing: '0.1em' }}>Total Cart Orders</span>
            <h2 style={{ fontSize: '36px', color: C.white, margin: '8px 0 4px 0', fontWeight: 800 }}>{orders.length}</h2>
            <span style={{ fontSize: '12px', color: C.gold }}>Pending: {orders.filter(o => o.status === 'pending').length}</span>
          </div>

          <div style={{
            background: C.maroonLight,
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: C.beige, opacity: 0.6, letterSpacing: '0.1em' }}>Total Order Revenue</span>
            <h2 style={{ fontSize: '36px', color: C.gold, margin: '8px 0 4px 0', fontWeight: 800 }}>₹{totalOrderRevenue.toLocaleString('en-IN')}</h2>
            <span style={{ fontSize: '12px', color: C.beige, opacity: 0.6 }}>From completed & pending checkouts</span>
          </div>

          <div style={{
            background: C.maroonLight,
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: C.beige, opacity: 0.6, letterSpacing: '0.1em' }}>Subscription Registrations</span>
            <h2 style={{ fontSize: '36px', color: C.white, margin: '8px 0 4px 0', fontWeight: 800 }}>{subscriptions.length}</h2>
            <span style={{ fontSize: '12px', color: C.success }}>Active/Pending: {activeSubscriptionCount}</span>
          </div>
        </div>

        {/* Dashboard Tabs & Search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(26, 3, 3, 0.8)',
            border: `1px solid ${C.border}`,
            padding: '4px',
            borderRadius: '8px'
          }}>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                background: activeTab === 'orders' ? `linear-gradient(135deg, ${C.goldDark}, ${C.gold})` : 'transparent',
                color: activeTab === 'orders' ? C.maroon : C.beige,
                border: 'none',
                padding: '12px 28px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Cart Checkouts ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              style={{
                background: activeTab === 'subscriptions' ? `linear-gradient(135deg, ${C.goldDark}, ${C.gold})` : 'transparent',
                color: activeTab === 'subscriptions' ? C.maroon : C.beige,
                border: 'none',
                padding: '12px 28px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Subscription Signups ({subscriptions.length})
            </button>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                background: C.maroonLight,
                border: `1px solid ${C.border}`,
                color: C.white,
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: C.gold }}>
            🕯️ Loading Sacred Dashboard Records...
          </div>
        ) : activeTab === 'orders' ? (
          /* Cart Orders List */
          <div style={{
            background: C.maroonLight,
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 25px rgba(0,0,0,0.2)'
          }}>
            {filteredOrders.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: C.beige, opacity: 0.5 }}>
                No cart checkout records found.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(197, 160, 89, 0.05)', borderBottom: `1px solid ${C.border}` }}>
                      <th style={{ padding: '16px 24px', color: C.gold, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Customer Info</th>
                      <th style={{ padding: '16px 24px', color: C.gold, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Delivery Address</th>
                      <th style={{ padding: '16px 24px', color: C.gold, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Items Sourced</th>
                      <th style={{ padding: '16px 24px', color: C.gold, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Total Amount</th>
                      <th style={{ padding: '16px 24px', color: C.gold, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '16px 24px', color: C.gold, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order._id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.2s' }}>
                        {/* Customer */}
                        <td style={{ padding: '20px 24px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, fontSize: '15px', color: C.white }}>{order.name}</div>
                          <div style={{ fontSize: '13px', opacity: 0.6, marginTop: '4px' }}>{order.email}</div>
                          <div style={{ fontSize: '13px', color: C.gold, marginTop: '4px' }}>{order.phone}</div>
                          <div style={{ fontSize: '11px', opacity: 0.4, marginTop: '8px' }}>Created: {new Date(order.createdAt).toLocaleString()}</div>
                        </td>
                        {/* Address */}
                        <td style={{ padding: '20px 24px', verticalAlign: 'top', fontSize: '13px', opacity: 0.8, maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          {order.address}
                        </td>
                        {/* Items */}
                        <td style={{ padding: '20px 24px', verticalAlign: 'top' }}>
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
                              {item.img && <img src={item.img} alt={item.name} style={{ width: '24px', height: '24px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />}
                              <div>
                                <span style={{ fontWeight: 600 }}>{item.name}</span>
                                <span style={{ opacity: 0.6, fontSize: '11px', marginLeft: '6px' }}>₹{item.price} × {item.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </td>
                        {/* Price */}
                        <td style={{ padding: '20px 24px', verticalAlign: 'top', fontSize: '18px', fontWeight: 800, color: C.gold }}>
                          ₹{order.totalAmount}
                        </td>
                        {/* Status */}
                        <td style={{ padding: '20px 24px', verticalAlign: 'top' }}>
                          <select
                            value={order.status}
                            onChange={e => handleAction('update_status', 'order', order._id, e.target.value)}
                            style={{
                              background: order.status === 'completed' ? C.success + '22' : 'rgba(197, 160, 89, 0.1)',
                              color: order.status === 'completed' ? C.success : C.gold,
                              border: `1px solid ${order.status === 'completed' ? C.success + '55' : C.gold + '55'}`,
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 700,
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="pending" style={{ background: C.maroonLight, color: C.gold }}>Pending</option>
                            <option value="completed" style={{ background: C.maroonLight, color: C.gold }}>Completed</option>
                          </select>
                        </td>
                        {/* Action */}
                        <td style={{ padding: '20px 24px', verticalAlign: 'top' }}>
                          <button
                            onClick={() => handleAction('delete', 'order', order._id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: C.error,
                              fontSize: '13px',
                              cursor: 'pointer',
                              opacity: 0.8,
                              textDecoration: 'underline'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Subscription Signups List */
          <div style={{
            background: C.maroonLight,
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 25px rgba(0,0,0,0.2)'
          }}>
            {filteredSubscriptions.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: C.beige, opacity: 0.5 }}>
                No subscription registrations found.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(197, 160, 89, 0.05)', borderBottom: `1px solid ${C.border}` }}>
                      <th style={{ padding: '16px 24px', color: C.gold, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Subscriber Info</th>
                      <th style={{ padding: '16px 24px', color: C.gold, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Delivery Address</th>
                      <th style={{ padding: '16px 24px', color: C.gold, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Plan Subscribed</th>
                      <th style={{ padding: '16px 24px', color: C.gold, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Billing Info</th>
                      <th style={{ padding: '16px 24px', color: C.gold, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '16px 24px', color: C.gold, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map(sub => (
                      <tr key={sub._id} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.2s' }}>
                        {/* Subscriber Info */}
                        <td style={{ padding: '20px 24px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, fontSize: '15px', color: C.white }}>{sub.name}</div>
                          <div style={{ fontSize: '13px', opacity: 0.6, marginTop: '4px' }}>{sub.email}</div>
                          <div style={{ fontSize: '13px', color: C.gold, marginTop: '4px' }}>{sub.phone}</div>
                          <div style={{ fontSize: '11px', opacity: 0.4, marginTop: '8px' }}>Registered: {new Date(sub.createdAt).toLocaleString()}</div>
                        </td>
                        {/* Address */}
                        <td style={{ padding: '20px 24px', verticalAlign: 'top', fontSize: '13px', opacity: 0.8, maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          {sub.address}
                        </td>
                        {/* Plan Subscribed */}
                        <td style={{ padding: '20px 24px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: C.white, fontSize: '14px' }}>{sub.planName}</div>
                          <div style={{ fontSize: '12px', opacity: 0.5, marginTop: '4px', textTransform: 'uppercase' }}>Plan ID: {sub.planId}</div>
                        </td>
                        {/* Billing Info */}
                        <td style={{ padding: '20px 24px', verticalAlign: 'top' }}>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: C.gold }}>₹{sub.planPrice}</div>
                          <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px', textTransform: 'capitalize' }}>Cycle: {sub.billingMode}</div>
                        </td>
                        {/* Status */}
                        <td style={{ padding: '20px 24px', verticalAlign: 'top' }}>
                          <select
                            value={sub.status}
                            onChange={e => handleAction('update_status', 'subscription', sub._id, e.target.value)}
                            style={{
                              background: sub.status === 'active' ? C.success + '22' : 'rgba(197, 160, 89, 0.1)',
                              color: sub.status === 'active' ? C.success : C.gold,
                              border: `1px solid ${sub.status === 'active' ? C.success + '55' : C.gold + '55'}`,
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 700,
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="pending" style={{ background: C.maroonLight, color: C.gold }}>Pending</option>
                            <option value="active" style={{ background: C.maroonLight, color: C.gold }}>Active</option>
                            <option value="cancelled" style={{ background: C.maroonLight, color: C.gold }}>Cancelled</option>
                          </select>
                        </td>
                        {/* Action */}
                        <td style={{ padding: '20px 24px', verticalAlign: 'top' }}>
                          <button
                            onClick={() => handleAction('delete', 'subscription', sub._id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: C.error,
                              fontSize: '13px',
                              cursor: 'pointer',
                              opacity: 0.8,
                              textDecoration: 'underline'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
