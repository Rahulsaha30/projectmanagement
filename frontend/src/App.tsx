import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuthStore } from './stores/authStore';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import ManagerPage from './pages/ManagerPage';
import EmployeePage from './pages/EmployeePage';
import theme from './theme';
import type { JSX } from 'react';

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
  const { isAuthenticated, role } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/my-tasks" />; // Fallback to safe page
  }

  return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<AuthPage />} />
            
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPage />
                </ProtectedRoute>
            } />
            
            <Route path="/manager" element={
                <ProtectedRoute allowedRoles={['manager', 'admin']}> 
                    <ManagerPage />
                </ProtectedRoute>
            } />
            
            <Route path="/my-tasks" element={
                <ProtectedRoute>
                    <EmployeePage />
                </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
};

function App() {
  const { checkTokenExpiry } = useAuthStore();

  // Initialize auth on app mount
  useEffect(() => {
    checkTokenExpiry();
  }, [checkTokenExpiry]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <ToastContainer />
        <AppRoutes />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

