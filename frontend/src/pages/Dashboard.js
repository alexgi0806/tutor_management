import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ users: 0, tutors: 0, classes: 0, students: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current user info from the users list (admin is the first user)
      const userResponse = await axios.get('http://localhost:8000/api/users/users/?page=1');
      if (userResponse.data.results && userResponse.data.results.length > 0) {
        setUserData(userResponse.data.results[0]);
      }

      // Get statistics
      try {
        const usersResponse = await axios.get('http://localhost:8000/api/users/users/?page_size=1');
        const tutorsResponse = await axios.get('http://localhost:8000/api/users/tutors/?page_size=1');
        const classesResponse = await axios.get('http://localhost:8000/api/classes/?page_size=1');
        const reviewsResponse = await axios.get('http://localhost:8000/api/feedback/reviews/?page_size=1');

        setStats({
          users: usersResponse.data.count || 0,
          tutors: tutorsResponse.data.count || 0,
          classes: classesResponse.data.count || 0,
          students: reviewsResponse.data.count || 0,
        });
      } catch (err) {
        console.warn('Could not fetch statistics:', err);
      }

      setError(null);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <span className="spinner"></span> Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {userData && (
        <div className="user-card card">
          <h2>Welcome, {userData.username}!</h2>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.is_staff ? 'Staff' : 'User'}</p>
          <p><strong>Member Since:</strong> {new Date(userData.date_joined).toLocaleDateString()}</p>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.users}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{stats.tutors}</h3>
          <p>Tutors</p>
        </div>
        <div className="stat-card">
          <h3>{stats.classes}</h3>
          <p>Classes</p>
        </div>
        <div className="stat-card">
          <h3>{stats.students}</h3>
          <p>Enrollments</p>
        </div>
      </div>

      <div className="card">
        <h2>Quick Stats</h2>
        <p>The system is connected and operational. Use the sidebar navigation to manage users, tutors, classes, and enrollments.</p>
      </div>
    </div>
  );
}

export default Dashboard;
