import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/common/Header';
import { RoleSelection } from './components/RoleSelection';
import { Dashboard as FarmerDashboard } from './components/farmers/Dashboard';
import { InvestorDashboard } from './components/investors/InvestorDashboard';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const RoleBasedRoute: React.FC<{
  element: React.ReactElement;
  requiredRole: string;
}> = ({ element, requiredRole }) => {
  const userRole = localStorage.getItem('userRole');
  return userRole === requiredRole ? (
    element
  ) : (
    <Navigate to="/role-selection" />
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/role-selection" />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route
              path="/farmer/dashboard"
              element={
                <PrivateRoute
                  element={
                    <RoleBasedRoute
                      element={<FarmerDashboard />}
                      requiredRole="farmer"
                    />
                  }
                />
              }
            />
            <Route
              path="/investor/dashboard"
              element={
                <PrivateRoute
                  element={
                    <RoleBasedRoute
                      element={<InvestorDashboard />}
                      requiredRole="investor"
                    />
                  }
                />
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};
