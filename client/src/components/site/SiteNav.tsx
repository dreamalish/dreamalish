// SiteNav.tsx
import React, { useContext } from 'react';
import { Navbar, Nav, NavItem, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchUsers from '../SearchUsers';
import AvatarImage from '../common/AvatarImage';
import { UserContext } from '../../contexts/UserContext';
import defaultProfilePic from '../../assets/defaultProfilePic.jpg';

export default function SiteNav({ logout }: { logout: () => void }) {
  const { currentUser } = useContext(UserContext);

  console.log("Navbar currentUser profilePic:", currentUser?.profilePic);

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
              onClick={logout}
            >
              Logout
            </span>
          </NavItem>
  
        </Nav>
  
      </Container>
    </Navbar>
  );
          }  