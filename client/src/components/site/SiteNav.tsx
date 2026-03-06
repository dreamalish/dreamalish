// SiteNav.tsx
import React, { useContext, useState, useEffect } from 'react';
import { authFetch } from '../../helper/APIHelper';
import { Navbar, Nav, NavItem, Container } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import SearchUsers from '../SearchUsers';
import AvatarImage from '../common/AvatarImage';
import NotificationsDropdown from '../notifications/NotificationsDropdown';
import { UserContext } from '../../contexts/UserContext';
import './SiteNav.css';

export default function SiteNav({ logout }: { logout: () => void }) {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  console.log("Navbar currentUser profilePic:", currentUser?.profilePic);
  
  useEffect(() => {
    loadUnreadCount();
  
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 20000); // every 20 seconds
  
    return () => clearInterval(interval);
  }, []);
  
  const loadUnreadCount = async () => {
    const data = await authFetch('/api/notifications/unread-count');
    setUnreadCount(data.unread);
  };

  const handleBellClick = async () => {
    setIsNotificationsOpen(prev => !prev);
  
    // Refresh unread count when opening
    if (!isNotificationsOpen) {
      await loadUnreadCount();
    }
  };

  return (
    <Navbar color="dark" dark expand="lg" className="px-3">
      <Link to="/" className="navbar-brand">Home</Link>
  
      <Container fluid>
  
        {/* LEFT SIDE */}
        <Nav navbar>
          <NavItem>
            <div style={{ position: "relative" }}>
              <SearchUsers />
            </div>
          </NavItem>
        </Nav>
  
        {/* RIGHT SIDE */}
        <Nav navbar className="ms-auto d-flex align-items-center">
        <div className="notifications-container">

          <div
            className="bell-icon"
            onClick={handleBellClick}> 🔔   

            {unreadCount > 0 && (
               <span className="notifications-badge">
               {unreadCount}
                </span>
           )}
          </div>

              <NotificationsDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}/>

          </div>
          
          {currentUser && (
            <NavItem className="me-3">
              <AvatarImage
                src={currentUser?.profilePic}
                size={32}
                className="rounded-circle"
                onClick={(e) => e.stopPropagation()}
              />
            </NavItem>
          )}
  
          <NavItem>
            <Link to="/profile" className="nav-link">Profile</Link>
          </NavItem>
  
          <NavItem>
            <span
              className="nav-link"
              style={{ cursor: 'pointer' }}
              onClick={()=>{
                logout();
                navigate("/");
              }}
            >
              Logout
            </span>
          </NavItem>
  
        </Nav>
  
      </Container>
    </Navbar>
  );
          }  