import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './src/context/AuthContext.jsx';
import AppRoutes from './src/routes/AppRoutes.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container min-vh-100 bg-light">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;