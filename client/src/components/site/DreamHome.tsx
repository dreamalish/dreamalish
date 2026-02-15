import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DreamBar from './navbar/DreamBar';
import APIURL from '../../helper/Environment';
import Profile from '../userData/Profile';
import PostIndex from '../postIndex/PostIndex';
import PublicIndex from '../publicDreams/PublicIndex';
import About from '../site/footer/About';
import { UserType } from '../../types/CustomTypes';
import DreamCatcher from '../../assets/image.jpg';
import { authFetch } from '../../helper/APIHelper';


type AcceptedProps = {
  clearToken: () => void;
};

type HomeState = {
  user: UserType;
};

export default class Home extends React.Component<
  AcceptedProps,
  HomeState
> {
  constructor(props: AcceptedProps) {
    super(props);

    this.state = {
      user: {
        id: 0,
        username: '',
        profilePic: '',
        nsfwOk: false,
        isAdmin: false,
        dreams: [],
        Comments: []
      }
    };
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = async () => {
    try {
      const res = await authFetch('/api/users/get');
      const data = await res.json();
  
      if (data.id) {
        this.setState({
          user: {
            id: data.id,
            username: data.username,
            profilePic: data.profilePic,
            nsfwOk: data.nsfwOk,
            isAdmin: data.isAdmin,
            dreams: data.dreams || [],
            Comments: data.comments || []
          }
        });
      }
    } catch (err) {
      this.props.clearToken();
    }
  };
  

  render() {
    const { user } = this.state;

    return (
      <div className="main">
        <DreamBar clearToken={this.props.clearToken} />

        {user.id !== 0 && (
          <Routes>

            {/* Home → Public Dreams */}
            <Route
              path="/"
              element={
                <PublicIndex
                  fetchUser={this.fetchUser}
                  user={user}
                />
              }
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* My Posts */}
            <Route
              path="/myposts"
              element={
                <PostIndex
                  user={user}
                  fetchUser={this.fetchUser}
                  dreams={user.dreams}

                />
              }
            />

            {/* About */}
            <Route
              path="/about"
              element={
                <About />
              }
            />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        )}

        {/* Footer */}
        <div id="mainFoot">
          <div className="leftFoot">
            <div className="trademark">
              <a href="/">
                <img
                  src={DreamCatcher}
                  height="30px"
                  alt="Dreamalish Logo"
                  id="logoFoot"
                />
              </a>
              <p>Dreamalish</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
