import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { loginUser, registerUser } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isLogin) {
      if (!email || !password) {
        setError('Please fill in all security fields.');
        setLoading(false);
        return;
      }
      try {
        await loginUser(email, password);
      } catch (err) {
        setError(err.response?.data?.msg || 'Authentication failed.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!username || !email || !password) {
        setError('Please fill in all registration fields.');
        setLoading(false);
        return;
      }
      try {
        await registerUser(username, email, password);
        setSuccess('Registration successful! Switch to Access Vault tab to log in.');
        setUsername('');
        setEmail('');
        setPassword('');
        setIsLogin(true);
      } catch (err) {
        setError(err.response?.data?.msg || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-black text-white text-center mb-2">ENTERPRISE GATEWAY</h2>
        <p className="text-slate-400 text-xs text-center mb-6 uppercase tracking-widest">MERN SaaS Portal</p>

        <div className="flex border-b border-slate-800 mb-6">
          <button type="button" onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }} className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${isLogin ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-500 hover:text-slate-300'}`}>
            Access Vault
          </button>
          <button type="button" onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }} className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${!isLogin ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-500 hover:text-slate-300'}`}>
            Create Credentials
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-950/50 border border-emerald-800 rounded-lg text-emerald-400 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors text-sm" placeholder="John Doe" />
            </div>
          )}

          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors text-sm" placeholder="admin@platform.com" />
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Security Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors text-sm" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-slate-950 font-bold uppercase py-3 rounded-lg transition-colors text-sm tracking-wider disabled:opacity-50">
            {loading ? "Authenticating Vault..." : isLogin ? "Access System" : "Register Credentials"}
          </button>
        </form>
      </div>
    </div>
  );
}