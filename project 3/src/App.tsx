import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthChoice } from './components/auth/AuthChoice';
import { SignupForm } from './components/auth/SignupForm';
import { LoginForm } from './components/auth/LoginForm';
import { BiometricSetup } from './components/auth/BiometricSetup';
import { BiometricVerification } from './components/auth/BiometricVerification';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserDashboard } from './components/user/UserDashboard';
import { useAuthStore } from './store/authStore';

const PrivateRoute = ({ children, requiresAdmin = false }: { children: React.ReactNode, requiresAdmin?: boolean }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/" />;
  if (requiresAdmin && user?.role !== 'admin') return <Navigate to="/user-dashboard" />;
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthChoice />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/admin-login" element={<LoginForm isAdmin />} />
        <Route path="/user-login" element={<LoginForm />} />
        <Route path="/biometric-setup" element={<BiometricSetup />} />
        <Route path="/biometric-verification" element={<BiometricVerification />} />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute requiresAdmin>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;