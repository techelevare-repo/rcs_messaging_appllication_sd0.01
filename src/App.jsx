import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import TopRightProfile from './components/TopRightProfile';
import AuthRoute from './components/AuthRoute';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import HistoryPage from './pages/HistoryPage';
import TestUpload from './components/TestUpload';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import Results from './pages/Results';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DeveloperPage from './pages/DeveloperPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import DoctorPatientManagement from './pages/DoctorPatientManagement';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Top App Bar */}
            <AppBar
              position="fixed"
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                ml: { xs: 0, md: '240px' },
                width: { xs: '100%', md: 'calc(100% - 240px)' },
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: 1
              }}
            >
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  RadiologyAI Dashboard
                </Typography>
                <TopRightProfile />
              </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                pl: { xs: 2, md: 1 }, // Reduced left padding to move content closer to sidebar
                pr: { xs: 2, md: 3 }, // Keep right padding for visual balance
                pt: { xs: '64px', md: '80px' }, // Account for top bar
                pb: 2,
                width: { md: `calc(100% - 240px)` }, // Slightly reduced offset
                ml: { md: '240px' }, // Moved content closer to sidebar
                minHeight: '100vh',
                bgcolor: 'background.default',
                overflow: 'auto',
                '& > *': {
                  maxWidth: '1400px', // Increased max width for more content space
                  pr: { md: 2 } // Add some padding on the right for larger screens
                }
              }}
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<AuthRoute><DashboardPage /></AuthRoute>} />
                <Route path="/dashboard" element={<AuthRoute><DashboardPage /></AuthRoute>} />
                <Route path="/upload" element={<AuthRoute><UploadPage /></AuthRoute>} />
                <Route path="/test-upload" element={<AuthRoute><TestUpload /></AuthRoute>} />
                <Route path="/results" element={<AuthRoute><Results /></AuthRoute>} />
                <Route path="/history" element={<AuthRoute><HistoryPage /></AuthRoute>} />
                <Route path="/reports" element={<AuthRoute><ReportsPage /></AuthRoute>} />
                <Route path="/settings" element={<AuthRoute><SettingsPage /></AuthRoute>} />
                <Route path="/profile" element={<AuthRoute><ProfilePage /></AuthRoute>} />
                <Route path="/admin" element={<AuthRoute><AdminDashboard /></AuthRoute>} />
                <Route path="/doctor-patients" element={<AuthRoute><DoctorPatientManagement /></AuthRoute>} />
                <Route path="/developer" element={<AuthRoute><DeveloperPage /></AuthRoute>} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}
