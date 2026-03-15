import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Auth from './components/auth/Auth';
import Profile from './components/postIndex/Profile';
import SiteNav from './components/site/SiteNav';
import PublicProfile from './components/postIndex/PublicProfile';
import Dreams from './components/postIndex/Dreams';
import LoggedOut from "./components/LoggedOut";

import './App.css';

// Analytics
import { initAnalytics, trackPageView } from './helper/analytics';

export default function App() {

  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const location = useLocation();

  // Initialize analytics once
  useEffect(() => {
    initAnalytics();
  }, []);

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  const updateToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h1 style={{ padding: '1rem' }}>dreamalish</h1>

      {!token ? (
        <>
          <Auth updateToken={updateToken} />
          <hr />
        </>
      ) : (
        <>
          <SiteNav logout={logout} />

          <Routes>
            <Route path="/" element={<Dreams />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/u/:username" element={<PublicProfile />} />
            <Route path="/logged-out" element={<LoggedOut />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      )}
    </div>
  );
}