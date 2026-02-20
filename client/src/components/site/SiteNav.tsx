import React from 'react';
import { Navbar, Nav, NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchUsers from '../SearchUsers';

export default function SiteNav({ logout }: { logout: () => void }) {
  return (
    <Navbar color="dark" dark expand="md" className="px-3">
      <Link to="/" className="navbar-brand">Home</Link>

      <Nav className="ms-auto" navbar>
      <NavItem>
        <div style={{position:"relative"}}>
        <SearchUsers /></div>
          
        </NavItem>
        
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
    </Navbar>
  );
}
