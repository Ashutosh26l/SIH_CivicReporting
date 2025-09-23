// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import UserLogin from './UserLogin';
import UserSignup from './UserSignup';
import './App.css';
import Home from './Home';
import IssuesList from './IssuesList';
import LandingPage from './landing_page'; // ✅ Corrected import

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect '/' to '/login' by default */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/issues" element={<IssuesList />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
