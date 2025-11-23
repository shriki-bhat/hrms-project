// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import RegisterOrg from './pages/RegisterOrg';
import Employees from './pages/Employees';
import Teams from './pages/Teams';
import Dashboard from './pages/Dashboard'; // NEW

function App() {
  const isAuth = !!localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterOrg />} />
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />

        <Route path="/employees" element={isAuth ? <Employees /> : <Navigate to="/login" />} />

        <Route path="/teams" element={isAuth ? <Teams /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
