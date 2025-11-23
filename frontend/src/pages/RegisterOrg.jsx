// src/pages/RegisterOrg.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const RegisterOrg = () => {
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.register({ orgName, adminName, email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black p-6">
      <div className="bg-gradient-to-br from-gray-950 to-black shadow-2xl rounded-lg p-12 w-full max-w-md border border-amber-600/10">
        {/* Logo */}
        <div className="text-center mb-10">
          <img 
            src="/logo.png" 
            alt="HRMS Connect" 
            className="h-20 mx-auto mb-6"
          />
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
            Create Organisation
          </h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase">Human Resource Management System Connect</p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4"></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-widest uppercase">
              Organisation Name
            </label>
            <input
              type="text"
              placeholder="e.g., Tech Solutions Ltd"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-white placeholder-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-widest uppercase">
              Admin Name
            </label>
            <input
              type="text"
              placeholder="Your full name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-white placeholder-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-widest uppercase">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-white placeholder-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-widest uppercase">
              Password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-white placeholder-gray-600"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-600 mt-1">Must be at least 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black p-4 rounded-lg text-base font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition mt-6"
          >
            {loading ? 'Creating Organisation...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <span
              className="text-amber-400 font-semibold underline cursor-pointer hover:text-amber-300 transition"
              onClick={() => navigate('/login')}
            >
              Sign In
            </span>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-600 tracking-widest uppercase">
            Enterprise-Grade Security
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterOrg;
