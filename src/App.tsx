import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppointmentProvider } from './context/AppointmentContext/AppointmentContext'
import PrivateRoute from './components/auth/PrivateRoute'
import PublicRoute from './components/auth/PublicRoute'
import Navbar from './components/layout/Navbar'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Appointments from './pages/Appointments/Appointments'
import Documents from './pages/Documents/Documents'
import Patients from './pages/Patients/Patients'           // 👈 NUEVO
import PatientDetail from './pages/Patients/PatientDetail' // 👈 NUEVO
import './App.css'

function App() {
    return (
        <AuthProvider>
            <AppointmentProvider>
                <div className="app">
                    <Navbar />
                    <main className="main">
                        <Routes>
                            {/* Redirigir root a dashboard */}
                            <Route path="/" element={<Navigate to="/dashboard" />} />

                            {/* Rutas públicas */}
                            <Route path="/login" element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            } />
                            <Route path="/register" element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            } />

                            {/* Rutas protegidas */}
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } />
                            <Route path="/appointments" element={
                                <PrivateRoute>
                                    <Appointments />
                                </PrivateRoute>
                            } />
                            <Route path="/documents" element={
                                <PrivateRoute>
                                    <Documents />
                                </PrivateRoute>
                            } />
                            <Route path="/patients" element={           // 👈 NUEVO
                                <PrivateRoute>
                                    <Patients />
                                </PrivateRoute>
                            } />
                            <Route path="/patients/:id" element={       // 👈 NUEVO
                                <PrivateRoute>
                                    <PatientDetail />
                                </PrivateRoute>
                            } />

                            {/* 404 */}
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </main>
                </div>
            </AppointmentProvider>
        </AuthProvider>
    )
}

export default App