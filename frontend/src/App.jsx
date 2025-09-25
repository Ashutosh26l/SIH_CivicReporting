// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserLogin from './UserLogin';
import UserSignup from './UserSignup';
import './App.css';
import Home from './Home';
import LandingPage from './LandingPage';
import IssueDetail from './IssueDetail';
import IssueList from './IssueList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/issue-detail" element={<IssueDetail />} />
        <Route path="/issuelist" element={<IssueList />} />
      </Routes>
    </Router>
  );
}

export default App;