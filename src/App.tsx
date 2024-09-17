import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import DogsSearch from './pages/DogsSearch';
import LoginPage from './pages/Login';
import { useAuth } from './Context/AuthContext';

import './index.css';

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      <Routes>
        {isAuthenticated && <Route path="/search" element={<DogsSearch />} />}
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<Navigate to={'/'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
