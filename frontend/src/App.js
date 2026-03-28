import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Pages
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Tutors from './pages/Tutors';
import Classes from './pages/Classes';
import Enrollments from './pages/Enrollments';
import Login from './pages/Login';
import Navigation from './components/Navigation';

// API client setup
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

axios.defaults.baseURL = API_URL;

// Request interceptor to add token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('/token/refresh/', { refresh: refreshToken });
        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return axios(originalRequest);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Navigation />}
        <div className={isLoggedIn ? 'app-layout' : 'login-layout'}>
          <Routes>
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/"
              element={
                isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/users"
              element={isLoggedIn ? <Users /> : <Navigate to="/login" />}
            />
            <Route
              path="/tutors"
              element={isLoggedIn ? <Tutors /> : <Navigate to="/login" />}
            />
            <Route
              path="/classes"
              element={isLoggedIn ? <Classes /> : <Navigate to="/login" />}
            />
            <Route
              path="/enrollments"
              element={isLoggedIn ? <Enrollments /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
