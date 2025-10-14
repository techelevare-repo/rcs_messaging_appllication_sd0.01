import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './state/AuthContext.jsx';
import { ModelProvider } from './state/ModelContext.jsx';
import { VisionProvider } from './state/VisionContext.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import DashboardHome from './pages/dashboard/Home.jsx';
import ModelsCatalog from './pages/dashboard/ModelsCatalog.jsx';
import VisionProcessing from './pages/dashboard/VisionProcessing.jsx';
import ResultsReports from './pages/dashboard/ResultsReports.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Users from './pages/users/Users.jsx';
import Roles from './pages/users/Roles.jsx';
import Profile from './pages/users/Profile.jsx';
import Settings from './pages/users/Settings.jsx';
import AdminPanel from './pages/admin/AdminPanel.jsx';

const App = () => {
    return (
        <AuthProvider>
            <ModelProvider>
                <VisionProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<DashboardHome />} />
                            <Route path="models" element={<ModelsCatalog />} />
                            <Route path="vision-processing" element={<VisionProcessing />} />
                            <Route path="results" element={<ResultsReports />} />
                            <Route path="users" element={<Users />} />
                            <Route path="roles" element={<Roles />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="admin" element={<AdminPanel />} />
                        </Route>

                        <Route path="/404" element={<NotFound />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                </VisionProvider>
            </ModelProvider>
        </AuthProvider>
    );
};

export default App;


