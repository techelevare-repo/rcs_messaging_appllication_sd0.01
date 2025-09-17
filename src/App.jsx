import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import HistoryPage from './pages/HistoryPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';
import DeveloperPage from './pages/DeveloperPage';

export default function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pl: { xs: 2, md: 1 }, // Reduced left padding to move content closer to sidebar
            pr: { xs: 2, md: 3 }, // Keep right padding for visual balance
            pt: { xs: '64px', md: 2 },
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
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
