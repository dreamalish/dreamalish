import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from '../src/components/auth/Auth';
import PostIndex from './components/postIndex/PostIndex';
import Profile from './components/postIndex/Profile';
import SiteNav from './components/site/SiteNav';
import PublicProfile from './components/postIndex/PublicProfile';
import './App.css';
import logo from '../src/assets/image.jpg';
import Dreams from './components/postIndex/Dreams';


type State = {
  token: string;
  userId: number | null;
};

export default class App extends React.Component<{}, State> {
  state: State = {
    token: localStorage.getItem('token') || '',
    userId: null,
  };

  componentDidMount() {
    this.decodeUser();
  }

  updateToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    this.setState({ token: newToken }, this.decodeUser);
  };

  logout = () => {
    localStorage.removeItem('token');
    this.setState({ token: '', userId: null });
  };

  decodeUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.setState({ userId: payload.id });
    } catch {
      this.logout();
    }
  };

  render() {
    const { token } = this.state;

    return (
     <div style={{ fontFamily: 'sans-serif' }}>
        <h1 style={{ padding: '1rem' }}> dreamalish</h1>

        {!token ? (
          <>
            <Auth updateToken={this.updateToken} />
            <hr />
          </>
        ) : (
          <>
            <SiteNav logout={this.logout} />

            <Routes>
              <Route path="/" element={<Dreams/>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/u/:username" element={<PublicProfile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </div>
    );
  }
}

