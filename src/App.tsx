import './index.css';
import DogsSearch from './pages/DogsSearch';
import LoginPage from './pages/Login';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useAuth } from './Context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/search"
          element={isAuthenticated ? <DogsSearch /> : <LoginPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
