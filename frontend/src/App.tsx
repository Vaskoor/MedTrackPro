import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AppointmentsPage from './pages/AppointmentsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import HealthTrackingPage from './pages/HealthTrackingPage';
import ChatPage from './pages/ChatPage';
import Layout from './layouts/Layout';

function App() {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }
  
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={
            user?.role === 'PATIENT' ? <PatientDashboard /> :
            user?.role === 'DOCTOR' ? <DoctorDashboard /> :
            user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />
          } />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/medical-records" element={<MedicalRecordsPage />} />
          <Route path="/health" element={<HealthTrackingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
export default App;
