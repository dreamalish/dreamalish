import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/auth/Auth';
import Profile from './components/postIndex/Profile';
import SiteNav from './components/site/SiteNav';
import PublicProfile from './components/postIndex/PublicProfile';
import './App.css';
import Dreams from './components/postIndex/Dreams';
import LoggedOut from "./components/LoggedOut";
import logogif from './assets/dreamalish-new.gif';

type State = {
  token: string;
};

export default class App extends React.Component<{}, State> {
  state: State = {
    token: localStorage.getItem('token') || '',
  };

  updateToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    this.setState({ token: newToken });
  };

  logout = () => {
    localStorage.removeItem('token');
  
    this.setState({
      token: ''
    });
  };

  render() {
    const { token } = this.state;

    return (
      <div style={{ fontFamily: 'sans-serif' }}>
        <h1 style={{ padding: '1rem' }}>dreamalish</h1>
        
        {!token ? (
          <>
            <Auth updateToken={this.updateToken} />
            <hr />
          </>
        ) : (
          <>
            <SiteNav logout={this.logout} />

            <Routes>
              <Route path="/" element={<Dreams />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/u/:username" element={<PublicProfile />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/logged-out" element={<LoggedOut />} />
            </Routes>
          </>
        )}
      </div>
      
    );
  }
}
