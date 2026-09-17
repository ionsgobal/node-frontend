import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import "./App.css";

export default function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p className="text-sm tracking-widest uppercase animate-pulse">Initializing System Vault...</p>
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
}