import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1 className="nav-title">Tutor Management</h1>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </li>
        <li>
          <Link to="/users" className="nav-link">Users</Link>
        </li>
        <li>
          <Link to="/tutors" className="nav-link">Tutors</Link>
        </li>
        <li>
          <Link to="/classes" className="nav-link">Classes</Link>
        </li>
        <li>
          <Link to="/enrollments" className="nav-link">Enrollments</Link>
        </li>
      </ul>

      <div className="nav-footer">
        <div className="user-info">
          <p className="user-name">Welcome, {username}</p>
        </div>
        <button onClick={handleLogout} className="button button-danger nav-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
