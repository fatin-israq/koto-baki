import React, { useState } from 'react';
import { BookOpen, Mail, Lock, Store, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';
import '../styles/LoginScreen.css';

export function LoginScreen({ onLoginSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [shopName, setShopName] = useState('');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasErrorShake, setHasErrorShake] = useState(false);

  const triggerError = (msg) => {
    setError(msg);
    setHasErrorShake(true);
    setTimeout(() => setHasErrorShake(false), 500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim() || !password.trim()) {
      triggerError('ইমেইল এবং পাসওয়ার্ড উভয় পূরণ করুন।');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);
      onLoginSuccess(res.access_token, {
        id: res.user_id,
        email: res.email,
        shopName: res.shop_name
      });
    } catch (err) {
      triggerError(err.message || 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!shopName.trim()) {
      triggerError('দোকানের নাম লিখুন।');
      return;
    }
    if (!email.trim()) {
      triggerError('ইমেইল ঠিকানা লিখুন।');
      return;
    }
    if (!password || password.length < 6) {
      triggerError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (password !== confirmPassword) {
      triggerError('পাসওয়ার্ড দুটি মেলেনি।');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(shopName, email, password);
      onLoginSuccess(res.access_token, {
        id: res.user_id,
        email: res.email,
        shopName: res.shop_name
      });
    } catch (err) {
      triggerError(err.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setTab('login');
    setEmail('demo@khata.bd');
    setPassword('demo1234');
    setError(null);
  };

  return (
    <div className="login-container">
      {/* Ambient glowing shapes */}
      <div className="login-glow-red" />
      <div className="login-glow-amber" />
      <div className="login-watermark">খ</div>

      {/* Tali Khata Paper Card */}
      <div className={`login-card ${hasErrorShake ? 'has-error' : ''}`}>
        <div className="login-margin-line" />

        {/* Brand Header */}
        <div className="login-header">
          <div className="login-icon-badge">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="login-title">মুদি দোকান খাতা</h1>
          <p className="login-subtitle">ভয়েস-ফার্স্ট ডিজিটাল লাল খাতা</p>
          <div className="login-divider" />
        </div>

        {/* Tab Switcher */}
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(null); }}
          >
            খাতায় প্রবেশ (Login)
          </button>
          <button
            type="button"
            className={`login-tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(null); }}
          >
            নতুন খাতা (Register)
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="error-msg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Content */}
        {tab === 'login' ? (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-field-group">
              <label className="input-label">ইমেইল ঠিকানা</label>
              <div className="input-wrapper">
                <Mail className="w-4 h-4 input-icon" />
                <input
                  type="email"
                  className="khata-input"
                  placeholder="shop@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-field-group">
              <label className="input-label">পাসওয়ার্ড</label>
              <div className="input-wrapper">
                <Lock className="w-4 h-4 input-icon" />
                <input
                  type="password"
                  className="khata-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="stamp-btn" disabled={loading}>
              {loading ? (
                <span>যাচাই করা হচ্ছে...</span>
              ) : (
                <>
                  <span>খাতায় প্রবেশ করুন</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleRegister}>
            <div className="input-field-group">
              <label className="input-label">দোকানের নাম</label>
              <div className="input-wrapper">
                <Store className="w-4 h-4 input-icon" />
                <input
                  type="text"
                  className="khata-input"
                  placeholder="মেসার্স রহিম স্টোর"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-field-group">
              <label className="input-label">ইমেইল ঠিকানা</label>
              <div className="input-wrapper">
                <Mail className="w-4 h-4 input-icon" />
                <input
                  type="email"
                  className="khata-input"
                  placeholder="shop@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-field-group">
              <label className="input-label">পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</label>
              <div className="input-wrapper">
                <Lock className="w-4 h-4 input-icon" />
                <input
                  type="password"
                  className="khata-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-field-group">
              <label className="input-label">পাসওয়ার্ড নিশ্চিত করুন</label>
              <div className="input-wrapper">
                <Lock className="w-4 h-4 input-icon" />
                <input
                  type="password"
                  className="khata-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="stamp-btn" disabled={loading}>
              {loading ? (
                <span>খাতা তৈরি হচ্ছে...</span>
              ) : (
                <>
                  <span>নতুন খাতা খুলুন</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Demo Account Quick Fill Helper */}
        <div className="login-footer">
          <div className="demo-hint" onClick={fillDemo}>
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
            ডেমো খাতা দেখুন: <strong>demo@khata.bd</strong> / <strong>demo1234</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
