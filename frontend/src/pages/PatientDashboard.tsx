import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Calendar, Pill, Activity, FileText } from 'lucide-react';

export default function PatientDashboard() {
  const { data: appointments } = useQuery({ queryKey: ['appointments'], queryFn: () => api.get('/appointments').then(res => res.data) });
  const { data: prescriptions } = useQuery({ queryKey: ['prescriptions'], queryFn: () => api.get('/prescriptions').then(res => res.data) });
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow"><Calendar className="mb-2" /> <h3 className="font-semibold">Upcoming Appointments</h3><p className="text-2xl">{appointments?.length || 0}</p></div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow"><Pill className="mb-2" /> <h3 className="font-semibold">Active Prescriptions</h3><p className="text-2xl">{prescriptions?.length || 0}</p></div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow"><Activity className="mb-2" /> <h3 className="font-semibold">Health Score</h3><p className="text-2xl">85</p></div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow"><FileText className="mb-2" /> <h3 className="font-semibold">Medical Records</h3><p className="text-2xl">12</p></div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-2">{/* map activity */}</ul>
      </div>
    </div>
  );
}
