// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import './App.css';
import IssuesList from './IssuesList';
import LandingPage from './LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/issues" element={<IssuesList />} />
      </Routes>
    </Router>
  );
}

export default App;